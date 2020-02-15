import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlSession {
  constructor () {
    console.log("Shighl SESSION loaded")
    this.webId = null

  }


    ///////////////////
    // Session
    //////////////////
    async track(cb) {
      var module = this
      auth.trackSession(async function(session) {
        if (!session){
          module.webId = null
        }else{
          module.webId = session.webId
        }
        cb(module.webId)
      })
    }

    async login() {
      const webId = await this.popupLogin()
      return `${webId}`
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

}

export default ShighlSession
