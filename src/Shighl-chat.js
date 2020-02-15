import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlChat {
  constructor (instance) {
    console.log("Shighl CHAT loaded")
    this.instance = instance
    this.folder = this.instance.url.substring(0,this.instance.url.lastIndexOf('/')+1)
    this.name = decodeURI(this.folder.slice(0, -1)).split("/").pop()
    }

  get init() {
    return (async () => {
      this.years = []
      for await (const year of data[this.folder]['ldp$contains']){
        if ( `${year}`.endsWith('/')){
          this.years.push(`${year}`.slice(0, -1).split("/").pop())
        }
      }
      this.years.sort()
      this.year = this.years[this.years.length - 1]
      //MONTH
      this.months = []
      for await (const month of data[this.folder+this.year+'/']['ldp$contains']){
        if ( `${month}`.endsWith('/')){
          this.months.push(`${month}`.slice(0, -1).split("/").pop())
        }
      }
      this.months.sort()
      this.month = ("0" + this.months[this.months.length - 1]).slice(-2)
      //DAY
      this.days = []
      for await (const day of data[this.folder+this.year+'/'+this.month+'/']['ldp$contains']){
        if ( `${day}`.endsWith('/')){
          this.days.push(`${day}`.slice(0, -1).split("/").pop())
        }
      }

      this.days.sort()
      this.day = ("0" + this.days[this.days.length - 1]).slice(-2)
      return this
      //  return (this.years)
      //  return instance
      //return `${s}`
    })();
  }

  get messages(){
    return (async () => {
      let friends = ["one","two"]
    /*  for await (const fwebid of data[this.webId].friends){
        var friend = {}
        friend.webId = `${fwebid}`
        friends.push(friend)
      }*/
      return friends
    })();

  }

  localName(str){
    var ln = str.substring(str.lastIndexOf('#')+1);
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }

}

export default ShighlChat
