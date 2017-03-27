const request = require('request');
const restify = require('restify');
const package = require('./package.json');

const Parser = require('./lib/parser');
const ExchangeRates = require('./lib/exchange_rates');

const rates = new ExchangeRates(request, new Parser());
const server = restify.createServer({ name: package.name, version: package.version });

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());

server.get('/update', (req, res, next) => {
  rates.update()
  .then(() => {
    res.send(200);
    next();
  })
  .catch(error => {
    console.error('error by updating', error);
    next(new Error('could not update rates'));
  });
});

server.get('/status', (req, res, next) => {
  res.send({ status: 'ok', last_updated: rates.lastUpdate() });
  next();
});

server.get('/rates', (req, res, next) => {
  res.send(rates.rates());
  next();
});

server.get('/exchange/:base/:target/:amount', (req, res, next) => {
  const { base, target, amount } = req.params;
  rates.exchange(base, target, amount)
  .then(result => {
    res.send({
      base_currency: base,
      target_currency: target,
      base_amount: amount,
      target_amount: result
    });
    next();
  })
  .catch(error => {
    console.error('error by exchange', error);
    next(new Error('could not calculate rates'));
  });
});

rates.update()
.then(() => {
  server.listen(8080, () => console.log(`${server.name}@${server.versions} listening at ${server.url}`));
})
.catch(error => console.error('something went wrong', error));
