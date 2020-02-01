import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";

class Shighl {
  /**
  * @param {SolidAuthClient} auth - An auth client, for instance solid-auth-client or solid-auth-cli
  * @param {SolidFileClientOptions} [options]
  */
  constructor () {
    console.log("ok")
    /*  super(auth.fetch.bind(auth), options)
    this._auth = auth*/
  }

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }

  async readName (url) {
    try {
      const fullname = await data.user.vcard$fn;
      console.log(`\nNAME: ${fullname}`);
      return `${fullname}`
    }catch(e){
      return e
    }
  }

  async getFriends(webId = this.webId){
    console.log(webId)
    this.friends = []
    for await (const fwebid of data[webId].friends){
      console.log(friend)
      var friend = {}
      friend.webId = `${fwebid}`
      this.friends = [... this.friends, friend]
    }
    console.log(this.friends)
    return this.friends
  }

}

export default Shighl
