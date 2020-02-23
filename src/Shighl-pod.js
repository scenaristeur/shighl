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

  set pti_new(params){
    return (async () => {
      let now = new Date()
      //console.log("Params ", params)
      let webId = params.user_pod.webId
      //index
      let path = params.url
      path = !path.endsWith("/") ? path+"/" : "";
      let index = path+"index.ttl"
      let date = now.toISOString()
      let id = index+"#id"+Date.parse(now)
      let i_this = index+"#this"
      //console.log(now, webId, date, index, i_this, id)

      //pti
      let pti = await user_pod.pti
      let pti_url = `${pti.url}`
      let pti_id = pti_url+"#id"+Date.parse(now)
      //console.log(`${pti}`, pti_id)

      // chat
      // first ldflex-query must be add to create the file, next we can use set
      await data[id].ic$dtstart.add(date)
      await data[id].flow$participant.set(namedNode(webId))
      await data[id].ui$backgroundColor.set("#e9dce4")
      await data[i_this].type.set(namedNode('http://www.w3.org/ns/pim/meeting#LongChat'))
      await data[i_this]['http://purl.org/dc/elements/1.1/author'].set(namedNode(webId))
      await data[i_this]['http://purl.org/dc/elements/1.1/created'].set(date)
      await data[i_this]['http://purl.org/dc/elements/1.1/title'].set("Chat channel")
      await data[i_this].flow$participation.set(namedNode(id))
      await data[i_this].ui$sharedPreferences.set(namedNode(path+":SharedPreferences"))

      //pti
      await data[pti_id].solid$forClass.set(namedNode('http://www.w3.org/ns/pim/meeting#LongChat'))
      await data[pti_id].solid$instance.set(namedNode(i_this))
      // chat.ttl & welcome message
      var messageId = "#Msg"+now.getTime()
      var month = ("0" + (now.getUTCMonth() + 1)).slice(-2); //months from 1-12
      var day = ("0" + now.getUTCDate()).slice(-2);
      var year = now.getUTCFullYear();
      var path_chat = path+[year, month, day, ""].join("/")
    //  console.log(path_chat)

      let content = "Welcome to "+index+"! You must grant Everyone to Poster in the shareTool of "+path
      var m_id = path_chat+"chat.ttl"+messageId
    //  console.log(date)
      //console.log(m_id)
      await data[m_id].dct$created.add(date)
      await data[m_id].sioc$content.add(content)
      await data[m_id].foaf$maker.add(namedNode(webId))
      await data.from(m_id)[i_this]['http://www.w3.org/2005/01/wf/flow#message'].add(namedNode(m_id))
      alert ("You must grant Everyone to Poster in the shareTool of "+path)



      /*
      @prefix : <#>.
      @prefix terms: <http://purl.org/dc/terms/>.
      @prefix XML: <http://www.w3.org/2001/XMLSchema#>.
      @prefix n: <http://rdfs.org/sioc/ns#>.
      @prefix n0: <http://xmlns.com/foaf/0.1/>.
      @prefix c: </profile/card#>.
      @prefix ind: <../../../index.ttl#>.
      @prefix flow: <http://www.w3.org/2005/01/wf/flow#>.

      :Msg1582422363863
      terms:created "2020-02-23T01:46:03Z"^^XML:dateTime;
      n:content "Welcome !";
      n0:maker c:me.
      ind:this flow:message :Msg1582422363863 .*/


      /* must do the same as

      @prefix : <#>.
      @prefix mee: <http://www.w3.org/ns/pim/meeting#>.
      @prefix ic: <http://www.w3.org/2002/12/cal/ical#>.
      @prefix XML: <http://www.w3.org/2001/XMLSchema#>.
      @prefix flow: <http://www.w3.org/2005/01/wf/flow#>.
      @prefix c: </profile/card#>.
      @prefix ui: <http://www.w3.org/ns/ui#>.
      @prefix n0: <http://purl.org/dc/elements/1.1/>.
      @prefix c0: <https://smag0.solid.community/profile/card#>.

      :id1582414878663
      ic:dtstart "2020-02-22T23:41:18Z"^^XML:dateTime;
      flow:participant c:me;
      ui:backgroundColor "#e9dce4".
      :this
      a mee:LongChat;
      n0:author c0:me;
      n0:created "2020-02-22T23:41:09Z"^^XML:dateTime;
      n0:title "Chat channel";
      flow:participation :id1582414878663;
      ui:sharedPreferences :SharedPreferences.

      */

      // pti
      //:id1579018946975 terms:forClass mee:LongChat; terms:instance ind:this.
      /* utilisation de terms ou solid ? https au lieu de http ?
      @prefix solid: <https://www.w3.org/ns/solid/terms#>.
      @prefix terms: <http://www.w3.org/ns/solid/terms#>.*/



      return "instance created"
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
                  s.shortClass = this.localName(s.classe)
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
