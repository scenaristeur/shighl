const chai = require('chai')
const expect = chai.expect


const Shighl = require('../src/Shighl')
let sh = new Shighl()

var assert = require('assert');
describe('Loading Shighl test', function() {
  describe('"Spoggy" is vcard$fullname of https://spoggy.solid.community/profile/card#me', function() {
    it('sh.test() should return "Spoggy"', async () => {
      let test = await sh.test()
      expect(test).to.equal("Spoggy")
    })

    it('sh.test() should return "Spoggy"', async () => {
      let test = await sh.test()
      expect(test).to.equal("Spoggy")
    })

  });
});
