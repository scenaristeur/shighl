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
      await data.clearCache()
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
      var path = this.folder+[this.year, this.month, this.day,""].join('/')
      console.log(path)
      this.documents = []
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
          if ( `${subject}` != this.instance.url){ // ne semble pas fonctionner ??
            if (`${subject}`.split('#')[1] != undefined && `${subject}`.split('#')[1].startsWith('Msg')){
              docs = [... docs, {url:`${subject}`}]
            }else{
              other = [... other, {url:`${subject}`}]
            }
            //console.log(docs)
          }
        }
        this.documents = docs
        //  return instance
      }catch(e){
        console.log(e)
        console.log("impossible to get messgaes")
        this.error = "No Chat message in "+path
        //  return instance
      }
      await this.detail()
      console.log("termine")
      return this.documents
    })();

  }

  async detail(){
    console.log ("DETAIL")
    for (const d of this.documents){
      d.maker = "boo"
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
  }
  return this.documents
}


async send(mess){
  console.log(mess)
  try {
    if (mess.content.length > 0){
      var dateObj = new Date();
      var messageId = "#Msg"+dateObj.getTime()
      var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
      var day = ("0" + dateObj.getUTCDate()).slice(-2);
      var year = dateObj.getUTCFullYear();
      var path = this.folder+[this.year, this.month, this.day, ""].join("/")
      console.log(path)

      var url = path+"chat.ttl"+messageId
      var date = dateObj.toISOString()
      var index = this.folder+"index.ttl#this"
      console.log(date)
      console.log(url)
      console.log(index)
      await data[url].dct$created.add(date)
      await data[url].sioc$content.add(mess.content)
      await data[url].foaf$maker.add(namedNode(mess.webId))
      await data.from(url)[index]['http://www.w3.org/2005/01/wf/flow#message'].add(namedNode(url))
      //  var postType = this.shadowRoot.querySelector('input[name="inlineRadioOptions"]:checked').value
      if (mess.postType != "InstantMessage"){
        await data[url].rdfs$type.add(namedNode('http://rdfs.org/sioc/types#'+mess.postType))
      }

      if (mess.replyTo != null && mess.replyTo.length >0){
        await data[url].rdfs$type.add(namedNode('https://schema.org/Comment'))
        await data[url].schema$parentItem.add(namedNode(mess.replyTo)) // schema$parentItem plante le chat solid
        await data[replyTo].schema$comment.add(namedNode(url))
      }
    }
    return "ok"
  }catch(e){
    alert(e)
    return e
  }

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
