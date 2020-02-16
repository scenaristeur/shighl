import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlInbox {
  constructor () {
    console.log("Shighl INBOX loaded")
    this.webId = null
  }


  set message(m){
    //  {inbox: inbox, webId: webId, content: content, postType: postType, replyTo: replyTo}
    console.log(m)
    return (async () => {
      // TODO : move to sh.inbox.notify
      try{
        let d = new Date(Date.now())
        let id = d.getTime()
        let url = m.inbox+message.id+".ttl"
        console.log(url)
        await data[url].schema$text.add(m.content);
        await data[url].rdfs$label.add(m.title)
        await data[url].schema$dateSent.add(d.toISOString())
        await data[url].rdf$type.add(namedNode('https://schema.org/Message'))
        await data[url].schema$sender.add(namedNode(m.sender))
        let notif = m.inbox+"log.ttl#"+id
        console.log(notif)
        await data[notif].schema$message.add(namedNode(url))

      }catch(e){
        alert(e)
      }
    })();
  }


  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }

  ////////////////////////////
  // Inbox
  //////////////////////////
  /*async getInbox(webId = this.webId){
  return await data[webId].ldp$inbox
}*/

async getMessages(inbox){
  this.messages = []
  try{
    for await (const mess of data[inbox]['ldp$contains']){
      //  console.log(`${mess}`)
      if ( `${mess}`.endsWith('/log.ttl') == false){
        try{
          var m = {}
          m.url = `${mess}`
          m.dateSent = new Date(await data[m.url].schema$dateSent)
          m.date = m.dateSent.toLocaleString(navigator.language)
          m.label = await data[m.url].rdfs$label
          m.sender = await data[m.url].schema$sender
          m.text = await data[m.url].schema$text
          m.senderName = await data[m.sender].vcard$fn;
          this.messages = [... this.messages, m]
        }catch(e){
          console.log(e, `${mess}`)
        }
      }
      else{
        this.messages.log = `${mess}`
      }
    }
    //  console.log(this.messages)
    return this.messages
  }catch(e){
    console.log(e)
  }
}



}

export default ShighlInbox
