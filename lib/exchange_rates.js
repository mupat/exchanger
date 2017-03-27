const Promise = require('bluebird');
const Big = require('big.js');

class ExchangeRates {
  constructor(request, parser) {
    this.request = Promise.promisify(request.get);
    this.parser = parser;
    this._rates = [];
    this.lastUpdatedDay = undefined;
  }

  lastUpdate() {
    return this.lastUpdatedDay;
  }

  rates() {
    return this._rates;
  }

  rateByCurrency(currency) {
    return this._rates.filter(rate => rate.currency === currency)[0]
  }

  exchange(baseCurrency, targetCurrency, givenAmount = 0) {
    return new Promise((resolve, reject) => {
      try {
        // get exchange rate of base currency, otherwise fail
        const base = this.rateByCurrency(baseCurrency);
        if(!base) throw(`base currency - ${baseCurrency} - currency not defined`);

        // get exchange rate of target currency, otherwise fail
        const target = this.rateByCurrency(targetCurrency);
        if(!target) throw(`target currency - ${targetCurrency} - currency not defined`);

        // get result in two steps
        // 1) calculate given amount from base currency to EUR
        // 2) calculate amount from first step from EUR to target currency
        const result = new Big(givenAmount).div(base.rate).times(target.rate);
        resolve(result.toFixed(2));
      } catch (error) {
        reject(error);
      }
    });
  }

  update() {
    return this.request('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml')
    .then(response => this.parser.parse(response.body)) // parse fetched xml file from string
    .then(result => { // extract time of actual fetch and only give elements to next step
      this.lastUpdatedDay = result.attributes.time
      return result.elements
    })
    .map(el => { return { currency: el.attributes.currency, rate: new Big(el.attributes.rate) } }) // map given values to actual used structure e.g. => { currency: 'EUR', Big('1') }
    .then(rates => { // push EUR as rate 1 in, to use in the calculation above
      rates.push({ currency: 'EUR', rate: new Big('1') });
      return rates;
    })
    .then(rates => this._rates = rates); // save to class
  }
}

module.exports = ExchangeRates;
