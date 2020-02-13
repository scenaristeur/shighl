//const chai = require('chai')
//const expect = chai.expect


//const Shighl = require('../src/Shighl')
//let sh = new Shighl()

//var assert = require('assert');
describe('User', function() {
  describe('"Spoggy" is vcard$fullname of https://spoggy.solid.community/profile/card#me', function() {
    it('sh.test() should return "Spoggy"', async () => {
  //  sh.trackSession(callbackSession)
    })

  /*  it('sh.test() should return "Spoggy"', async () => {
      let test = await sh.test()
      expect(test).to.equal("Spoggy")
    })*/

  });
});

const info = document.getElementById("info")
const login_btn = document.getElementById("login_btn")
const logout_btn = document.getElementById("logout_btn")


//////////////////////////////////
//  Login / Logout
//////////////////////////////////
async function login(){
  const webId = await sh.login()
  afterLogin(webId)
}

async function logout(){
  await sh.logout()
  afterLogout()
}

function afterLogin(webId){
  alert("You are logged with "+webId)
}

function afterLogout(){
  alert("You are not logged")
}

//////////////////////////////////
//getWebId
//////////////////////////////////
const info2 = document.getElementById("info2")
async function getWebId(){

  var webId = await sh.getWebId()
  console.log(webId)
  info2.innerHTML = webId
}
