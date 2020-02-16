import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlSession {
  constructor () {
    console.log("Shighl SESSION loaded")
  }


  ///////////////////
  // Session
  //////////////////
  async track(cb) {
    var module = this
    auth.trackSession(async function(session) {
      if (!session){
        module._webId = null
      }else{
        module._webId = session.webId
      }
      cb(module._webId)
    })
  }

  async login() {
    this._webId = await this.popupLogin()
    return `${this._webId}`
  }

  async logout() {
    auth.logout()
  }

  async popupLogin() {
    let session = await auth.currentSession();
    let popupUri = './dist-popup/popup.html';
    if (!session)
    {
      session = await auth.popupLogin({ popupUri });
      return session.webId
    }else{
      return null
    }
  }

  get webId(){
    return this._webId
  }

}

export default ShighlSession
