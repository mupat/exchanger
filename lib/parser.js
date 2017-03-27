const Promise = require('bluebird');
const convert = require('xml-js').xml2js;

class Parser {
  constructor() {
    this.options = {
      compact: false,
      spaces: 2,
      ignoreDeclaration: true
    }
  }

  parse(xml) {
    return new Promise((resolve, reject) => {
      try {
        const rates = convert(xml, this.options)
        .elements[0]
        .elements
        .filter(els => els.name === 'Cube')[0]
        .elements[0]
        resolve(rates);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = Parser;
