//const chai = require('chai')



//const Shighl = require('../src/Shighl')
let webId, inbox, messages

//var assert = require('assert');
describe('Inbox test', async function() {

  describe('inbox of '+`${webId}`, function() {
    this.timeout(15000);
    it('sh.getWebId() not null', async () => {
      webId = await sh.getWebId()
      console.log(webId)
      expect(webId).to.not.equal(null)
    })


    it('inbox should not be null', async () => {
      inbox = await sh.inbox.getInbox(webId)
      expect(`${inbox}`).to.not.equal(null)
    })

    it.skip('inbox message should be writtable', async () => {
      let inbox = await sh.inbox.getAcl(inbox)
      expect(`${inbox}`).to.not.equal(null)
    })

    it.skip('new message shoulb be created', async () => {
      let inbox = await sh.inbox.getMessages(inbox)
      expect(`${inbox}`).to.not.equal(null)
    })

    it('inbox messages should not be empty', async () => {

      messages = await sh.inbox.getMessages(inbox)
      console.log(messages)
      expect(`${messages}`).to.not.equal(null)
    })





  });
});
