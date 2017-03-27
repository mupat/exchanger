const Promise = require('bluebird');
const Big = require('big.js');

class ExchangeRates {
  constructor(request, parser) {
    this.request = Promise.promisify(request.get);
    this.parser = parser;
    this.rates = [];
    this.lastUpdatedDay = undefined;
  }

  lastUpdate() {
    return this.lastUpdatedDay;
  }

  rates() {
    return this.rates;
  }

  update() {
    return this.fetch()
    .then(response => response.body)
    .then(content => this.parser.parse(content))
    .then(result => {
      this.lastUpdatedDay = result.attributes.time
      return result.elements
    })
    .map(element => element.attributes)
    .map(element => { return { currency: element.currency, value: new Big(element.rate) } })
    .then(rates => this.rates = rates);
  }

  fetch() {
    return this.request('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml')
  }
}

module.exports = ExchangeRates;
