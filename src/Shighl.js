import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

///////////////////////////////////////////////////////////////////////////////
// What is a Shighl ?
// Shighl, is for S-olid high L-evel
// a tool that let you write simple html/js to interact with a Solid POD
// Session, Profile, Inbox, Chat...
// Source : https://github.com/scenaristeur/shighl/
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Qu'est-ce que Shighl ?
// Shighl, c'est pour S-olid high L-evel
// un outil qui vous permet d'écrire du simple html/js pour interagir avec un POD Solid
// Session, Profil, Messagerie, Chat...
// Source : https://github.com/scenaristeur/shighl/
///////////////////////////////////////////////////////////////////////////////

class Shighl {
  constructor () {
    console.log("Shighl loaded")
    this.webId = null
    this.friends = []
  }

  async test(){
    var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
    console.log(`${name}`);
  }

  ///////////////////
  // Session
  //////////////////
  async trackSession(cb) {
    var module = this
    auth.trackSession(async function(session) {
      if (!session){
        module.webId = null
      }else{
        module.webId = session.webId
      }
      cb(module.webId)
    })
  }

  async login() {
    const webId = await this.popupLogin()
    return `${webId}`
  }

  logout() {
    auth.logout()
  }

  async popupLogin() {
    let session = await auth.currentSession();
    let popupUri = './dist-popup/popup.html';
    if (!session)
    {
      session = await auth.popupLogin({ popupUri });
      return session.webId
    }else{
      return null
    }
  }

  getWebId(){
    return this.webId
  }


  ///////////////
  //Profile
  //////////////
  async getName (webId = this.webId) {
    try {
      const fullname = await data[webId].vcard$fn;
      return `${fullname}`
    }catch(e){
      return e
    }
  }

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
    }
  }

  /////////////////////
  // publicTypeIndex
  ////////////////////
  async getPublicTypeIndex(webId){
    console.log(webId)
    var pti = {}
    pti.url = await data[webId].publicTypeIndex
    try{
      if (`${pti.url}` != "undefined"){
        pti.instances = []
        for await (const subject of data[pti.url].subjects){
          //  console.log(`${subject}`);
          if (`${pti.url}` != `${subject}`) {
            const s = {subject: `${subject}`}
            for await (const property of subject.properties)
            {
              if (`${property}` == "http://www.w3.org/ns/solid/terms#instance")    {
                //  console.log( "--",`${property}`);
                const instance = await data[subject][`${property}`]
                const classe = await data[subject].solid$forClass
                //  console.log( "--nn",`${instance}`);
                s.predicate = `${property}`
                s.object = `${instance}`
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
    return pti
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
        console.log(`${mess}`)
        if ( `${mess}`.endsWith('/log.ttl') == false){
          var m = {}
          m.url = `${mess}`
          m.dateSent = new Date(await data[m.url].schema$dateSent)
          m.date = m.dateSent.toLocaleString(navigator.language)
          m.label = await data[m.url].rdfs$label
          m.sender = await data[m.url].schema$sender
          m.text = await data[m.url].schema$text
          m.senderName = await data[m.sender].vcard$fn;
          this.messages = [... this.messages, m]
        }
        else{
          this.messages.log = `${mess}`
        }
      }
      console.log(this.messages)
      return this.messages
    }catch(e){
      return e
    }
  }

  // Instances Lonchat, Notes ...
  //getDetails(messageUrl), sendMessage(inbox_dest)
  async initInstance(instance){
    //console.log("not finished yet", instance)
    switch(instance.shortClasse) {
      case "LongChat":
      //  return await this.getCalendar(instance)
      //  return await this.initLongChatInstance(instance)
      break;
      case "TextDigitalDocument":
      case "MediaObject":
      case "Bookmark":
      case "Meeting":
      default:
      return  await this.getDefaultInstance(instance)
    }
  }
  /*
  async getLongChatInstance(instance){
  instance = await this.getCalendar(instance)
  //  instance = await this.getLongChatMessages(instance)
  //  instance = await this.getLongChatMessagesDetails(instance)
  console.log(instance)
  return instance
}*/

async initLongChatInstance(instance){
  instance.folder = instance.object.substring(0,instance.object.lastIndexOf('/')+1)
  instance.name = this.localName(instance.folder)  //YEAR
  var years = []
  for await (const year of data[instance.folder]['ldp$contains']){
    if ( `${year}`.endsWith('/')){
      var localyear = this.localName(`${year}`.slice(0, -1))
      years.push(localyear)
    }
  }
  let last_year = Math.max(...years)
  //MONTH
  var months = []
  for await (const month of data[instance.folder+last_year+'/']['ldp$contains']){
    if ( `${month}`.endsWith('/')){
      var localmonth = this.localName(`${month}`.slice(0, -1))
      months.push(localmonth)
    }
  }
  let last_month = ("0" + Math.max(...months)).slice(-2)
  //DAY
  var days = []
  for await (const day of data[instance.folder+last_year+'/'+last_month+'/']['ldp$contains']){
    if ( `${day}`.endsWith('/')){
      var localday = this.localName(`${day}`.slice(0, -1))
      days.push(localday)
    }
  }
  instance.years = years.sort()
  instance.months = months.sort()
  instance.days = days.sort()
  instance.year = last_year
  instance.month = last_month
  instance.day = ("0" + Math.max(...days)).slice(-2)
  console.log(instance)
  return instance
}

async getLongChatMessages(instance){
  var path = instance.folder+[instance.year, instance.month, instance.day,""].join('/')
  console.log(path)
  //console.log("Clear")

  try{
    let chatfile = await data[path]['ldp$contains'];
    console.log("ChatFile",`${chatfile}`);
    //  let documents = []
    var docs = []
    var other = []
    await data.clearCache()
    for await (const subject of data[chatfile].subjects){
      //  console.log("subject", `${subject}` );
      if ( `${subject}` != instance.object){ // ne semble pas fonctionner ??
        if (`${subject}`.split('#')[1] != undefined && `${subject}`.split('#')[1].startsWith('Msg')){
          docs = [... docs, {url:`${subject}`}]
        }else{
          other = [... other, {url:`${subject}`}]
        }
        //console.log(docs)
      }
    }
    instance.documents = docs
    instance.other = other
    console.log(instance)
    //  return instance
  }catch(e){
    console.log(e)
    console.log("impossible to get messgaes")
    instance.erreur = "No Chat message in "+path
    //  return instance
  }
  instance = await this.getLongChatMessagesDetails(instance)
  return instance
}

async getMonthsOfYear(instance){

  //MONTH
  var months = []
  for await (const month of data[instance.folder+instance.year+'/']['ldp$contains']){
    //  console.log("MONTH",`${month}`);
    if ( `${month}`.endsWith('/')){
      var localmonth = this.localName(`${month}`.slice(0, -1))
      months.push(localmonth)
    }
  }
  instance.months = months
  return instance
}

async getDaysOfMonth(instance){

  //DAY
  var days = []
  for await (const day of data[instance.folder+instance.year+'/'+instance.month+'/']['ldp$contains']){
    if ( `${day}`.endsWith('/')){
      var localday = this.localName(`${day}`.slice(0, -1))
      days.push(localday)
    }
  }
  instance.days = days
  return instance
}



async asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async getLongChatMessagesDetails(instance){
  await this.asyncForEach(instance.documents, async (d) => {
    //  await instance.documents.forEach(async function(d){
    //filtre les messages
    //  console.log(d)

    d.types = []
    d.comments = []
    d.statements = []
    var values = []
    for await (const property of data[d.url].properties) {
      //  console.log("Prop",`${property}`)
      switch(`${property}`) {
        case "http://xmlns.com/foaf/0.1/maker":
        let maker = await data[d.url][`${property}`]
        //  console.log(`${maker}`)
        let makername = await data[`${maker}`].vcard$fn
        //  console.log(`${makername}`)
        let makerimg = await data[`${maker}`].vcard$hasPhoto
        //  console.log(`${makerimg}`)
        d.maker = `${maker}`
        d.makername = `${makername}`
        d.makerimg = `${makerimg}`
        break;
        case "http://purl.org/dc/terms/created":
        let date = await data[d.url][`${property}`]
        d.date = `${date}`
        break;
        case "http://rdfs.org/sioc/ns#content":
        let content = await data[d.url][`${property}`]
        d.content = `${content}`
        break;
        case "http://www.w3.org/2000/01/rdf-schema#type":
        for await (const type of data[d.url][`${property}`]){
          let ty = `${type}`
          d.types = [... d.types, ty]
        }
        break;
        case "http://schema.org/parentItem":
        case "http://schema.org/target":
        let parentItem = await data[d.url][`${property}`]
        d.parentItem = `${parentItem}`
        break;
        case "http://schema.org/comment":
        for await (const comment of data[d.url][`${property}`]){
          let co = `${comment}`
          d.comments = [... d.comments, co]
        }
        break;

        default:
        //  console.log("default", this.url)

        for await (const val of data[d.url][`${property}`])
        {
          /*if(`${val}` == "http:/schema.org/AgreeAction" || `${val}` == "http:/schema.org/DisagreeAction"){
          d.likeAction = true
        }*/
        let  va = `${val}`
        values.push(va)
        //  console.log(values)
      }

      d.statements = [... d.statements, {property: `${property}` , values: values}]
    }

  }

});
return instance
}

async getDefaultInstance(instance){
  instance.documents = []
  for await (const subject of data[instance.object].subjects){
    //  console.log(`${subject}`);
    const doc = `${subject}`
    instance.documents.push(doc)
  }
  return instance
}

async sendChatMessage(instance, content, webId, postType = null, replyTo = null, inbox = null){
  console.log(instance, content, webId, postType, replyTo, inbox)
  try {
    if (content.length > 0){
      var dateObj = new Date();
      var messageId = "#Msg"+dateObj.getTime()
      var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
      var day = ("0" + dateObj.getUTCDate()).slice(-2);
      var year = dateObj.getUTCFullYear();
      var path = instance.folder+[year, month, day, ""].join("/")
      console.log(path)

      var url = path+"chat.ttl"+messageId
      var date = dateObj.toISOString()
      var index = instance.folder+"index.ttl#this"
      console.log(date)
      console.log(url)
      console.log(index)
      await data[url].dct$created.add(date)
      await data[url].sioc$content.add(content)
      await data[url].foaf$maker.add(namedNode(webId))
      await data.from(url)[index]['http://www.w3.org/2005/01/wf/flow#message'].add(namedNode(url))
      //  var postType = this.shadowRoot.querySelector('input[name="inlineRadioOptions"]:checked').value
      if (postType != "InstantMessage"){
        await data[url].rdfs$type.add(namedNode('http://rdfs.org/sioc/types#'+postType))
      }

      if (replyTo != null && replyTo.length >0){
        await data[url].rdfs$type.add(namedNode('https://schema.org/Comment'))
        await data[url].schema$parentItem.add(namedNode(replyTo)) // schema$parentItem plante le chat solid
        await data[replyTo].schema$comment.add(namedNode(url))

        try{
          // post notification
          var message = {}
          message.recipient =  inbox
          message.title = "Chat reply notif."
          message.content = url+" is a new reply to your post' "+replyTo

          if( message.recipient.length > 0){
            message.date = new Date(Date.now())
            message.id = message.date.getTime()
            message.sender = webId
            message.url = message.recipient+message.id+".ttl"
            await this.buildMessage(message)
            //  console.log("NOTIF",message)

          }else{
            alert("Recipient  empty")
          }
        }catch(e){
          alert(e)
        }
      }
    }
    return "ok"
  }catch(e){
    alert(e)
    return e
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

/*
async getDetails(messageUrl){

}*/



async getPages(folder){
  var pages = {}
  var years = []
  for await (const year of data[folder]['ldp$contains']){
    //  console.log("YEAR",`${year}`);
    if ( `${year}`.endsWith('/')){
      var localyear = this.localName(`${year}`.slice(0, -1))
      years.push(localyear)
    }
  }
  //  console.log(years)
  var last_year = Math.max(...years)

  //MONTH
  var months = []
  for await (const month of data[folder+last_year+'/']['ldp$contains']){
    //  console.log("MONTH",`${month}`);
    if ( `${month}`.endsWith('/')){
      var localmonth = this.localName(`${month}`.slice(0, -1))
      months.push(localmonth)
    }
  }
  //  console.log(months)
  var last_month = ("0" + Math.max(...months)).slice(-2)

  //DAY
  var days = []
  for await (const day of data[folder+last_year+'/'+last_month+'/']['ldp$contains']){
    //  console.log("DAY",`${day}`);
    if ( `${day}`.endsWith('/')){
      var localday = this.localName(`${day}`.slice(0, -1))
      days.push(localday)
    }
  }
  //console.log(days)
  var last_day = ("0" + Math.max(...days)).slice(-2)
  //  console.log("Last day",last_day)

  pages.years = years.sort()
  pages.months = months.sort()
  pages.days = days.sort()
  pages.year = last_year
  pages.month = last_month
  pages.day = last_day
  pages.folder = folder
  return pages
}

async getMessages1(pages){
  var messages = []
  console.log(pages)
  var path = pages.folder+[pages.year,pages.month,pages.day,""].join('/')
  //  console.log(path)
  //console.log("Clear")
  await data.clearCache()
  let chatfile = await data[path]['ldp$contains'];
  //  console.log("ChatFile",`${chatfile}`);

  for await (const subject of data[chatfile].subjects){
    //  console.log("subject", `${subject}` );
    if (( `${subject}` != pages.folder) && ( `${subject}` != chatfile) && ( `${subject}` != pages.instance)){ // ne semble pas fonctionner ??
      messages = [... messages, `${subject}`]
      //console.log(docs)
    }
  }
  //  console.log(docs)
  messages.sort().reverse()
  console.log(messages)
  return messages
}

async messageDetails(msgurl){
  console.log(msgurl)
  var details = {}
  details.date = await data[msgurl]['http://purl.org/dc/terms/created']
  return details
}

localName(str){
  var ln = str.substring(str.lastIndexOf('#')+1);
  //console.log(ln)
  ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
  return ln
}

testCallBack(cb){
  var test = "this is a test for your callback"
  cb(test)
}



}

export default Shighl
