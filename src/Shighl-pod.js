import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';


class ShighlPod {
  constructor () {
    console.log("Shighl POD loaded")
  }

  get webId() {
    return this._webId
  }

  set webId(webId) {
    this._webId = webId
  }

  get name() {
    return (async () => {
    var n = await data[this._webId].vcard$fn;
    return `${n}`
  })();
}

set name(name) {
  return (async () => {
    var n = await data[this._webId].vcard$fn.set(name);
    return `${n}`
  })();
}

get photo() {
  return (async () => {
    var p = await data[this._webId].vcard$hasPhoto;
    return `${p}`
  })();
}

set photo(url) {
  return (async () => {
    var p = await data[this._webId].vcard$hasPhoto.set(url);
    return `${p}`
  })();
}

get inbox(){
  return (async () => {
    var ib = await data[this._webId].ldp$inbox
    return `${ib}`
  })();
}

get friends() {
  return (async () => {
    let friends = []
    for await (const fwebid of data[this._webId].friends){
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
    let url = await data[this._webId].publicTypeIndex
    pti.url = `${url}`
    //console.log(pti)
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
    //console.log(pti)
    return pti
  })();
}

get privatetypeindex() {
  return (async () => {
    console.log("todo")
    /*  var prti = await data[this._webId].vcard$fn;
    return `${prti}`*/
  })();
}

get role() {
  return (async () => {
    var s = await data[this._webId].vcard$role;
    return `${s}`
  })();
}

set role(role) {
  return (async () => {
    var s = await data[this._webId].vcard$role.set(role);
    return `${s}`
  })();
}

get storage() {
  return (async () => {
    var s = await data[this._webId]['http://www.w3.org/ns/pim/space#storage'];
    return `${s}`
  })();
}

get instances() {
  return (async () => {
    let friends = []
    for await (const fwebid of data[this._webId].friends){
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
