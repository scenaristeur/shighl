import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

///////////////////////////////////////////////////////////////////////////////
// What is a Shighl ?
// Shighl, is for S-olid high L-evel
// a tool that let you write simple html/js to interact with a Solid POD
// Session, Profile, Inbox, Chat...
// Source : https://github.com/scenaristeur/shighl/
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Qu'est-ce que Shighl ?
// Shighl, c'est pour S-olid high L-evel
// un outil qui vous permet d'écrire du simple html/js pour interagir avec un POD Solid
// Session, Profil, Messagerie, Chat...
// Source : https://github.com/scenaristeur/shighl/
///////////////////////////////////////////////////////////////////////////////

class ShighlInbox {
  constructor () {
    console.log("Shighl INBOX loaded")
    this.webId = null
    this.friends = []
  }

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }



}

export default ShighlInbox
