import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

import ShighlInbox from './Shighl-inbox'
import ShighlSession from './Shighl-session'
import ShighlChat from './Shighl-chat'
import ShighlPod from './Shighl-pod'
import ShighlHola from './Shighl-hola'
import ShighlNotes from './Shighl-notes'

class Shighl {
  constructor () {
    console.log("Shighl loaded")
    this.webId = null
    this.friends = []
    this.inbox = ShighlInbox
    this.session = ShighlSession
    this.chat = ShighlChat
    this.pod = ShighlPod
    this.hola = ShighlHola
    this.notes = ShighlNotes
  }

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
    return `${name}`
  }

}

export default Shighl

//module.exports = Shighl;
