import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";

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
  trackSession(cb) {
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
  async getInstanceDetails(instance){
    console.log("not finished yet", instance)
    switch(instance.shortClasse) {
      case "LongChat":
      return await this.getLongChatInstance(instance)
      break;
      case "TextDigitalDocument":
      case "MediaObject":
      case "Bookmark":
      case "Meeting":
      default:
      return  await this.getDefaultInstance(instance)
    }
  }

  async getLongChatInstance(instance){
    instance = await this.getCalendar(instance)
    instance = await this.getLongChatMessages(instance)
    instance = await this.getLongChatMessagesDetails(instance)
    console.log(instance)
    return instance
  }

  async getCalendar(instance){
    instance.folder = instance.object.substring(0,instance.object.lastIndexOf('/')+1)
    //YEAR
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
    //  console.log(path)
    //console.log("Clear")
    await data.clearCache()
    let chatfile = await data[path]['ldp$contains'];
    //  console.log("ChatFile",`${chatfile}`);
    let documents = []
    var docs = []
    for await (const subject of data[chatfile].subjects){
      //  console.log("subject", `${subject}` );
      if ( `${subject}` != instance.object){ // ne semble pas fonctionner ??
        docs = [... docs, {url:`${subject}`}]
        //console.log(docs)
      }
    }
    instance.documents = docs
    console.log(instance)
    return instance
  }

  async getLongChatMessagesDetails(instance){
    await instance.documents.forEach(async function(d){
      //filtre les messages
      if (d.url.split('#')[1].startsWith('Msg')){
        d.types = []
        d.comments = []
        d.statements = []
        var values = []
      //  console.log(d.url)
        for await (const property of data[d.url].properties) {
          //  console.log("Prop",`${property}`)
          switch(`${property}`) {
            case "http://xmlns.com/foaf/0.1/maker":
            var maker = await data[d.url][`${property}`]
            console.log(`${maker}`)
            d.maker = `${maker}`
            d.makername = await data[`${d.maker}`].vcard$fn
            d.makerimg = await data[`${d.maker}`].vcard$hasPhoto
            break;
            case "http://purl.org/dc/terms/created":
            d.date = await data[d.url][`${property}`]
            break;
            case "http://rdfs.org/sioc/ns#content":
            d.content = await data[d.url][`${property}`]
            break;
            case "http://www.w3.org/2000/01/rdf-schema#type":
            for await (const type of data[d.url][`${property}`]){
              d.types = [... d.types, `${type}`]
            }
            break;
            case "http://schema.org/parentItem":
            case "http://schema.org/target":
            d.parentItem = await data[d.url][`${property}`]
            break;
            case "http://schema.org/comment":
            for await (const comment of data[d.url][`${property}`]){
              d.comments = [... d.comments, `${comment}`]
            }
            break;

            default:
            //  console.log("default", this.url)

            for await (const val of data[d.url][`${property}`])
            {
              /*if(`${val}` == "http:/schema.org/AgreeAction" || `${val}` == "http:/schema.org/DisagreeAction"){
              d.likeAction = true
            }*/
            values.push(`${val}`)
            console.log(values)
          }

          d.statements = [... d.statements, {property: `${property}` , values: values}]
        }

      }
    }
  });
  return instance
}

async getDefaultInstance(instance){
  instance.documents = []
  for await (const subject of data[instance.object].subjects){
    console.log(`${subject}`);
    const doc = `${subject}`
    instance.documents.push(doc)
  }
  return instance
}




async getDetails(messageUrl){

}



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
