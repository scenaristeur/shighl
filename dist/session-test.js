//const chai = require('chai')



//const Shighl = require('../src/Shighl')


//var assert = require('assert');
describe('Loading Shighl test', async function() {
  describe('"Spoggy" is vcard$fullname of https://spoggy.solid.community/profile/card#me', function() {
    it('sh.test() should return "Spoggy"', async () => {
      let test = await sh.test()
      expect(test).to.equal("Spoggy")
    })
  });
});


describe('Session test', async function() {
  describe('Session verification', function() {

    it('sh.getWebId() not null', async () => {
      let webId = await sh.getWebId()
      console.log(webId)
      expect(webId).to.not.equal(null)
    })

  });
});
