import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';


class ShighlNotes {
  constructor (webId) {
    console.log("Shighl Notes loaded")
    this.webId = webId
  }

  //new sh.user("https://solidarity.inrupt.net/profile/card#me").name
  get name() {
    return (async () => {
      var n = await data[this.webId].vcard$fn;
      return `${n}`
    })();
  }

  get photo() {
    return (async () => {
      var p = await data[this.webId].vcard$hasPhoto;
      return `${p}`
    })();
  }

  get friends() {
    return (async () => {
      let friends = []
        for await (const fwebid of data[this.webId].friends){
          var friend = {}
          friend.webId = `${fwebid}`
          friends.push(friend)
        }
        return friends
    })();
  }





}

export default ShighlNotes
