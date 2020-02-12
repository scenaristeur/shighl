import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlUser {
  constructor () {
    console.log("Shighl USER loaded")
    this.webId = null
    this.friends = []
  }

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }

}

export default ShighlUser
