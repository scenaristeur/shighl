import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';


class ShighlPod {
  constructor (webId) {
    console.log("Shighl POD loaded")
    this.webId = webId
  }

  //new sh.pod("https://solidarity.inrupt.net/profile/card#me").name
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

  get pti() {
    return (async () => {
      var pti = {}
      let url = await data[this.webId].publicTypeIndex
      pti.url = `${url}`
      console.log(pti)
      try{
        if (`${pti.url}` != "undefined"){
          pti.instances = []
          for await (const subject of data[pti.url].subjects){
            //  console.log(`${subject}`);
            if (`${pti.url}` != `${subject}`) {
              const s = {instance: `${subject}`}
              for await (const property of subject.properties)
              {
                if (`${property}` == "http://www.w3.org/ns/solid/terms#instance")    {
                  //  console.log( "--",`${property}`);
                  const url = await data[subject][`${property}`]
                  const classe = await data[subject].solid$forClass
                  //  console.log( "--nn",`${instance}`);
                //  s.predicate = `${property}`
                  s.url = `${url}`
                  s.classe = `${classe}`
                  //  s.path = `${instance}`.split("/")
                  s.shortClasse = this.localName(s.classe)
                }
              }
              pti.instances.push(s)
            }
          }
        }
      }catch(e){
        console.log(e)
      }
      console.log(pti)
      return pti
    })();
  }

  get privatetypeindex() {
    return (async () => {
      var prti = await data[this.webId].vcard$fn;
      return `${prti}`
    })();
  }

  get storage() {
    return (async () => {
      var s = await data[this.webId].vcard$fn;
      return `${s}`
    })();
  }

  get instances() {
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


  localName(str){
    var ln = str.substring(str.lastIndexOf('#')+1);
    //console.log(ln)
    ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
    return ln
  }
  /*
  sh.pod.name.set(string)
  */
}

export default ShighlPod
