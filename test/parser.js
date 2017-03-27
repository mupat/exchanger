import test from 'ava';
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

test.beforeEach(t => {
  t.context.parser = new Parser();
});

test('sets the correct options', t => {
  t.deepEqual(t.context.parser.options, { compact: false, spaces: 2, ignoreDeclaration: true });
});

test('parse a given xml file', async t => {
  const result = t.context.parser.parse(testXML);

  t.is((await result).attributes.time, '2017-03-24');
  t.deepEqual((await result).elements[0], {
    attributes: {
      currency: "USD",
      rate: "1.0805",
    },
    name: "Cube",
    type: "element",
  });
});
