import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlInbox {
  constructor () {
    console.log("Shighl INBOX loaded")
    this.webId = null
    this.friends = []
  }

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }

  ////////////////////////////
  // Inbox
  //////////////////////////
  async getInbox(webId = this.webId){
    return await data[webId].ldp$inbox
  }

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

  async chatNotif(){
    // TODO : move to sh.inbox.notify
    try{
      // post notification
      var message = {}
      message.recipient =  mess.inbox
      message.title = "Chat reply"
      message.content = url+" is a reply to' "+mess.replyTo

      if( message.recipient.length > 0){
        message.date = new Date(Date.now())
        message.id = message.date.getTime()
        message.sender = mess.webId
        message.url = message.recipient+message.id+".ttl"
        await this.inbox.buildMessage(message)
        //  console.log("NOTIF",message)

      }else{
        alert("Recipient  empty")
      }
    }catch(e){
      alert(e)
    }
  }



  async buildMessage(message){
    var mess = message.url
    console.log(message)
    try{
      await data[mess].schema$text.add(message.content);
      await data[mess].rdfs$label.add(message.title)
      await data[mess].schema$dateSent.add(message.date.toISOString())
      await data[mess].rdf$type.add(namedNode('https://schema.org/Message'))
      await data[mess].schema$sender.add(namedNode(this.webId))
      var notif = message.recipient+"log.ttl#"+message.id
      await data[notif].schema$message.add(namedNode(mess))
    }catch(e){
      alert(e)
    }
  }

}

export default ShighlInbox
