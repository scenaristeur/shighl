import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlInbox {
  constructor (inbox) {
    console.log("Shighl INBOX loaded")
    this.webId = null
    this.inbox = inbox
  }


  set message(m){
    //  this.inbox = m.inbox
    //  {inbox: inbox, webId: webId, content: content, postType: postType, replyTo: replyTo}
    console.log(m)
    console.log(this.inbox)
    return (async () => {
      // TODO : move to sh.inbox.notify
      try{
        let d = new Date(Date.now())
        let id = d.getTime()
        let url = this.inbox+id+".ttl"
        console.log(url)
        await data[url].schema$text.add(m.content);
        await data[url].rdfs$label.add(m.title)
        await data[url].schema$dateSent.add(d.toISOString())
        await data[url].rdf$type.add(namedNode('https://schema.org/Message'))
        await data[url].schema$sender.add(namedNode(m.sender))
        if(m.parentItem != undefined ){
          await data[url].schema$parentItem.add(namedNode(m.parentItem))
        }
        let notif = this.inbox+"log.ttl#"+id
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
  await data.clearCache()
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
          m.parentItem = await data[m.url].schema$parentItem;
          m.senderName = await data[m.sender].vcard$fn || `${m.sender}`.split("/")[2].split('.')[0];
          m.senderImg = await data[m.sender].vcard$hasPhoto || ""
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

async delete(url){
  //https://github.com/inrupt/generator-solid-react/blob/1902a0483754f6b2df4d3eb040c9991cc2c92663/generators/app/templates/src/utils/ldflex-helper.js#L20
  try {
    try{
      var id = url.split("/").pop().split('.')[0]
      console.log(this.messages.log, id)
      var path = this.messages.log+"#"+id
      await data.from(this.messages.log)[path]['schema:message'].delete(namedNode(url))
    }catch (e) {
      throw e;
    }
    return await auth.fetch(url, { method: 'DELETE' });
  } catch (e) {
    throw e;
  }

}

}

export default ShighlInbox
