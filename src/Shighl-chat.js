import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ShighlChat {
  constructor () {
    console.log("Shighl CHAT loaded")
  }
  set instance(instance) {
    this._instance = instance
    this._folder = this._instance.url.substring(0,this._instance.url.lastIndexOf('/')+1)
    this._name = decodeURI(this._folder.slice(0, -1)).split("/").pop()
  }

  get instance() {
    return this._instance
  }

  get lastPost() {
    return this._lastPost
  }

  get init() {
    return (async () => {
      await data.clearCache()
      this._years = []
      for await (const year of data[this._folder]['ldp$contains']){
        if ( `${year}`.endsWith('/')){
          this._years.push(`${year}`.slice(0, -1).split("/").pop())
        }
      }
      this._years.sort()
      this._year = this._years[this._years.length - 1]
      //MONTH
      this._months = []
      for await (const month of data[this._folder+this._year+'/']['ldp$contains']){
        if ( `${month}`.endsWith('/')){
          this._months.push(`${month}`.slice(0, -1).split("/").pop())
        }
      }
      this._months.sort()
      this._month = ("0" + this._months[this._months.length - 1]).slice(-2)
      //DAY
      this._days = []
      for await (const day of data[this._folder+this._year+'/'+this._month+'/']['ldp$contains']){
        if ( `${day}`.endsWith('/')){
          this._days.push(`${day}`.slice(0, -1).split("/").pop())
        }
      }

      this._days.sort()
      this._day = ("0" + this._days[this._days.length - 1]).slice(-2)
      return this
      //  return (this._years)
      //  return instance
      //return `${s}`
    })();
  }

  get messages(){
    return (async () => {
      var path = this._folder+[this._year, this._month, this._day,""].join('/')
      console.log(path)
      this._documents = []
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
          if ( `${subject}` != this._instance.url){ // ne semble pas fonctionner ??
            if (`${subject}`.split('#')[1] != undefined && `${subject}`.split('#')[1].startsWith('Msg')){
              docs = [... docs, {url:`${subject}`}]
            }else{
              other = [... other, {url:`${subject}`}]
            }
            //console.log(docs)
          }
        }
        this._documents = docs
        //  return instance
      }catch(e){
        console.log(e)
        console.log("impossible to get messgaes")
        this._error = "No Chat message in "+path
        //  return instance
      }
      await this.detail()
      console.log("termine")
      return this._documents
    })();

  }

  async detail(){
    console.log ("DETAIL")
    for (const d of this._documents){
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
          //  console.log("default", this._url)

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
  return this._documents
}


set message(mess){
  return (async () => {
    console.log(mess)
    try {
      if (mess.content.length > 0){
        var dateObj = new Date();
        var messageId = "#Msg"+dateObj.getTime()
        var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); //months from 1-12
        var day = ("0" + dateObj.getUTCDate()).slice(-2);
        var year = dateObj.getUTCFullYear();
        var path = this._folder+[this._year, this._month, this._day, ""].join("/")
        console.log(path)

        var url = path+"chat.ttl"+messageId
        this._lastPost = url
        var date = dateObj.toISOString()
        var index = this._folder+"index.ttl#this"
        console.log(date)
        console.log(url)
        console.log(index)
        await data[url].dct$created.add(date)
        await data[url].sioc$content.add(mess.content)
        await data[url].foaf$maker.add(namedNode(mess.webId))
        await data.from(url)[index]['http://www.w3.org/2005/01/wf/flow#message'].add(namedNode(url))
        //  var postType = this._shadowRoot.querySelector('input[name="inlineRadioOptions"]:checked').value
        if (mess.postType != "InstantMessage"){
          await data[url].rdfs$type.add(namedNode('http://rdfs.org/sioc/types#'+mess.postType))
        }

        if (mess.replyTo != null && mess.replyTo.length >0){
          await data[url].rdfs$type.add(namedNode('https://schema.org/Comment'))
          await data[url].schema$parentItem.add(namedNode(mess.replyTo)) // schema$parentItem plante le chat solid
          await data[mess.replyTo].schema$comment.add(namedNode(url))
        }
      }
      return "ok"
    }catch(e){
      alert(e)
      return e
    }
  })();
}

set subscribe(callback){
let module = this
module.callback = callback
var myEfficientFn = this.debounce(function(data) {
	// All the taxing stuff you do
  //  console.log("Update",data)
  callback(data)
}, 1000); //250

//window.addEventListener('resize', myEfficientFn);

  console.log("Websocket", this)
  let websocket = "wss://"+this._folder.split('/')[2];
  let url = this._folder+[this._year,this._month,this._day,"chat.ttl"].join('/')
  this._socket = new WebSocket(websocket);
  this._socket.onopen = function() {
    this.send('sub '+url);
  };
  this._socket.onmessage = function(msg) {
  //  console.log(msg)
    if (msg.data && msg.data.slice(0, 3) === 'pub') {
      console.log("websocket timestamp",msg.timeStamp)

      myEfficientFn(msg.data)
    //  module.callback(msg.data)

    }
  };
}

 debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


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
