import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';


class ShighlUser {
  constructor (webId) {
    console.log("Shighl USER loaded")
    this.webId = webId
    this.friends = []
  //  this.name = new Name()
  //  this.name.get = this.bar
  //  this.photo = {get: this.photo_get()}

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

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }
/*
  async name_get(webId = this.webId) {
    try {
      const fullname = await data[webId].vcard$fn;
      return `${fullname}`
    }catch(e){
      return e
    }
  }
  async name_set(webId) {
    console.log("TODO : user.name.set")
  }

  async photo_get(webId){
    return await data[webId].vcard$hasPhoto
  }*/

}


///////////////
//Profile
//////////////

/*
async getPhoto(webId = this.webId){
return await data[webId].vcard$hasPhoto
}

async getFriends(webId = this.webId){
this.friends = []
try{
for await (const fwebid of data[webId].friends){
//  console.log(friend)
var friend = {}
friend.webId = `${fwebid}`
this.friends = [... this.friends, friend]
}
return this.friends
}catch(e){
return e
}*/


export default ShighlUser
