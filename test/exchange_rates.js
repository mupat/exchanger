import test from 'ava';
const Rates = require('../lib/exchange_rates');
const Parser = require('../lib/parser');
const testXML = `<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref">
<gesmes:subject>Reference rates</gesmes:subject>
<gesmes:Sender>
<gesmes:name>European Central Bank</gesmes:name>
</gesmes:Sender>
<Cube>
<Cube time="2017-03-24">
<Cube currency="USD" rate="1.0805"/>
<Cube currency="JPY" rate="120.09"/>
<Cube currency="BGN" rate="1.9558"/>
</Cube>
</Cube>
</gesmes:Envelope>`

const request = {
  get: (url, cb) => {
    return cb(null, { body: testXML });
  }
}

test.beforeEach(t => {
  t.context.rates = new Rates(request, new Parser());
});

test.cb('#update', t => {
  t.context.rates.update()
  .then(() => {
    t.is(t.context.rates._rates.length, 4);
    t.end();
  });
});

test.cb('#lastUpdate', t => {
  t.context.rates.update()
  .then(() => {
    t.is(t.context.rates.lastUpdate(), '2017-03-24');
    t.end();
  });
});

test.cb('#rates', t => {
  t.context.rates.update()
  .then(() => {
    t.is(t.context.rates.rates().length, 4);
    t.end();
  });
});

test.cb('#rateByCurrency', t => {
  t.context.rates.update()
  .then(() => {
    t.deepEqual(t.context.rates.rateByCurrency('USD').currency, 'USD');
    t.end();
  });
});

test.cb('#exchange from eur', t => {
  t.context.rates.update()
  .then(() => {
    t.context.rates.exchange('EUR', 'USD', 100)
    .then((result) => {
      t.is(result, "108.05");
      t.end();
    });
  });
});

test.cb('#exchange without eur', t => {
  t.context.rates.update()
  .then(() => {
    t.context.rates.exchange('USD', 'JPY', 100)
    .then((result) => {
      t.is(result, "11114.30");
      t.end();
    });
  });
});
