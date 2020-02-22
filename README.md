////////////////////
# What is a Shighl ?
- Shighl, is for S-olid high L-evel
- a tool that let you write simple html/js to interact with a Solid POD
- Session, Profile, Inbox, Chat...

# Qu'est-ce que Shighl ?
- Shighl, c'est pour S-olid high L-evel
- un outil qui vous permet d'écrire du simple html/js pour interagir avec un POD Solid
- Session, Profil, Messagerie, Chat...

////////////////////

# Shighl
## Examples
- see /dist folder for examples or [https://scenaristeur.github.io/shighl/](https://scenaristeur.github.io/shighl/)
- An example of this chat functionnalities is running on [show INSTANCE EXAMPLE](https://scenaristeur.github.io/shighl/instances.html)

## Usage
### Browser
use cdn.jsdelivr.net
```
<script src="https://cdn.jsdelivr.net/gh/scenaristeur/shighl@master/dist/vendor/solid-auth-client.bundle.js"> </script>
<script src="https://cdn.jsdelivr.net/gh/scenaristeur/shighl@master/dist/vendor/solid-query-ldflex.bundle.js"> </script>
<script src="https://cdn.jsdelivr.net/gh/scenaristeur/shighl@master/dist/window/shighl.bundle.js"> </script>
```
or shighl.bundle.js, solid-query-ldflex.bundle.js, solid-auth-client.bundle.js that you can find in the /dist/ folder.
```
<script src="./vendor/solid-auth-client.bundle.js"></script>
<script src="./vendor/solid-query-ldflex.bundle.js"></script>
<script src="./window/shighl.bundle.js"></script>
```

### Es6 module / nodejs
install with ```npm install --save scenaristeur/shighl``` and import with
```
import  Shighl  from 'shighl'
```
### Login Popup
You will probably also need to copy the dist/dist-popup folder that provides you the better way to connect to a Solid Pod

### Create a Shighl Object
```
const sh = new Shighl()
sh.test() // optional te verify that the lib is loaded
```
then you must create Objects from Shighl submodules :
## pod.name for getting the name of a pod

- For example, to get the name of a pod, you need a basic Shighl object that you can get with above ``` const sh = new Shighl() ```.
- When you have got that ```sh``` variable representing Shighl object, you can create a pod object with ```let pod = new sh.pod()```
- You must then set the webId of the pod that you want to read the name with ```pod.webId = "https://[podname].[provider]/profile/card#me"```
- And then to get the "name" property or attribute of the pod use

```
let name = await pod.name;
console.log(name)
```
- That must give you the name of the pod in 5 lines of code
- You can now easily get the other properties/attributes of the pod with ```let photo = await pod.photo``` and same with pod.friends, pod.role, pod.storage, pod.pti
- pod.pti is a particular object as it represent the publicTypeIndex of the pod with the instances declared in it

- An instance is a resource that the pod owner wants you to be able to discover, so that he put a reference to it. A resource could be some text, some image, or any media that is stored on his pod, by him or by someone else. It could also be a resource that is stored on another pod.
- You can get each of the instances with
```
for (const inst of pti.instances){
  console.log(inst)
}
```
- Created this way, each instance property/attribute can be obtained by the same way that we used for the pod. To get the instance url use inst.url and to get the instance short class ... inst.shortClass !!! Yeah, yo got it !!!
- And that shortClass could be something like "TextDigitalDocument", "MediaObject", "Bookmark", "Meeting", or ... "LongChat" ...
- A "LongChat" is an interesting thing on a Solid pod, it allows you to create a chat, a space for discussions. You own it, host it on your pod, give it a name, and a path where you want to put it on your pod. You also can manage the right of access (read/write, person/group). This way everyone can "host" every discussion he wants... I let you imagine what you can do with such functionnality...
- If, with the above ```  console.log(inst) ``` you find some instance that have a shortClass property you can try to set that instance in a chat object that you first create from our starting "sh" variable. To create that chat object, do as above a ``` let chat = new sh.chat() ``` then set the instance property of the chat with that instance ```
chat.instance = instance ``` and initialize the chat with

```
let chat_details = await chat.init
console.log(chat_details)
```

- Once the chat has been initialized with an instance, you can get the last messages of the last day someone posted something in that instance of chat
```
let messages = await chat.messages
for(const message of messages){
  console.log(message)
}
```
- Then you can get the details of each message with ``` message.content, message.makername, message.makerimg, message.date ```
- If you want to get older messages, or other properties of that instance of chat, you have to look closer at the chat_details object that we created above and that represent stable and mutable propertiesof the instance of chat. _instance, _folder, and _name should be quite stable, opposed to the other.
```
{"_instance":{
  "instance":"https://solidarity.inrupt.net/settings/publicTypeIndex.ttl#id1581799359461",
  "url":"https://solidarity.inrupt.net/public/Shighl/Shighl/index.ttl#this",
  "classe":"http://www.w3.org/ns/pim/meeting#LongChat",
  "shortClass":"LongChat"
  },
  "_folder":"https://solidarity.inrupt.net/public/Shighl/Shighl/",
  "_name":"Shighl",
  "_years":["2020"],
  "_year":"2020",
  "_months":["02"],
  "_month":"02",
  "_days":["15","16","17"],
  "_day":"17"
}
```

plural :
- _years is an array that gives you the years when someone posted in this instance
- _months an array that represent the months when someone posted in the last year of _years array
- _days an array of days that represent the days when someone posted in the last month of _months array.


singulier:
_year, _month, _day represent the "cursor" where you want to get the messages.

So the example above gives you the messages of the 02/17/2020 or 17/02/2020 in french.
To get the message of the day before, just set the _day of your chat object to "16" with something like this

```
chat._day = "16"
```
and get the messages of the day as we did before with chat.messages

-  [optional] : you can subscribe to a chat instance with ```chat.subscribe = on_new_message ``` where on_new_message is the name of the callback function that is called when a new message arrive is posted in the chat.

What a call back function could be :

```
function on_new_message(changement){
  console.log ("new Message arrived,  get it from Websocket", changement)
  chatUpdate()
}
```

An example of this chat functionnalities is running on [show INSTANCE EXAMPLE](https://scenaristeur.github.io/shighl/instances.html)

or [codepen](https://codepen.io/spoggy/pen/ExjNQJd) (can't log review how to add popuplogin)




- [x] pod.pti (return publicTypeIndex & instances)
- [x] pod.role
- [x] pod.storage


```
const sh = new Shighl()
let pod = new sh.pod()
pod.webId = "https://spoggy.solid.community/profile/card#me" // set "https://spoggy.solid.community/profile/card#me" to pod.webId
let name = await pod.name //get pod.name
console.log(name)
```
checked function are implemented
### getting pod infos
- [x] pod.name
- [x] pod.photo
- [x] pod.friends
- [x] pod.pti (return publicTypeIndex & instances)
- [x] pod.role
- [x] pod.storage
### setting pod infos
- [x] pod.name = "New name"
- [x] pod.photo = "photo_url" (photo must be stored on your pod, todo copy photo to pod/profile)
- [x] pod.role = "New Role"
- [ ] pod.pti =  for creating a new pti instance (bookmark, notes, longchat...)

- [see sh.pod live example](https://scenaristeur.github.io/shighl/pod.html)
- [codepen version](https://codepen.io/spoggy/pen/eYNZNoO)

```
<html>
<script src="./vendor/solid-auth-client.bundle.js"></script>
<script src="./vendor/solid-query-ldflex.bundle.js"></script>
<script src="./window/shighl.bundle.js"></script>
<script>
async function init(){
  let sh = new Shighl()
  console.log(sh)
  let pod = new sh.pod()
  pod.webId = "https://spoggy.solid.community/profile/card#me"

  let name = await pod.name
  let photo = await pod.photo
  let friends = await pod.friends
  let pti = await pod.pti
  let role = await pod.role
  let storage = await pod.storage

  console.log("Name: ",name)
  console.log("Photo: ",photo)
  console.log("Friends: ",friends)
  console.log("publicTypeIndex & instances: ",pti)
  console.log("Role:",role)
  console.log("Storage: ",storage)  
}
</script>
<body onload="init()">
Look the web console to see the pod infos (Ctrl+Maj+i)
</body>
</html>
```

what Shighl does :

```
let pod = new sh.pod()
pod.webId = "mywebId"
//example : pod = "https://solidarity.inrupt.net/profile/card#me"
let name = await pod.name  --> return String
let photo = await pod.photo --> return String of photo url
let friends = await pod.friends --> return Array of webId
let pti = await pod.pti --> read the pod publicTypeIndex & return pti.url & pti.instances (an Array of instances)
````
then each pti instance has keys :
```
classe: "http://www.w3.org/ns/pim/meeting#LongChat"
​​​instance: "https://spoggy.solid.community/settings/publicTypeIndex.ttl#id1579184973294"
​​​shortClass: "LongChat"
​​​url: "https://spoggy.solid.community/public/thirdChat/index.ttl#this"
```

## let session = new sh.session()
[see sh.session live example](https://scenaristeur.github.io/shighl/session.html)
- [x] session.track(callback) listen session changes and then execute callback
- [x] session.login() return webId if logged else open login popup & return webId
- [x] session.logout()
- [x] session.webId return webId/null

```
<html>
<script src="./vendor/solid-auth-client.bundle.js"></script>
<script src="./vendor/solid-query-ldflex.bundle.js"></script>
<script src="./window/shighl.bundle.js"></script>
<body onload="init()">
Look the web console to see the pod infos (Ctrl+Maj+i)<br><br>
Session : <span id="info"></span>
<button id="login_btn" onclick="session.login()">Login</button>
<button id="logout_btn" onclick="session.logout()">Logout</button>

<script>
const info = document.getElementById("info")
const login_btn = document.getElementById("login_btn")
const logout_btn = document.getElementById("logout_btn")
const sh = new Shighl()
let session = new sh.session()

async function init(){
  await session.track(mycallback)
}

function mycallback(webId){
  console.log("WebId: ",webId)
  if (webId != null){
    info.innerHTML = webId
    login_btn.style.display = "none"
    logout_btn.style.display = "block"
  }
  else{
    info.innerHTML = "No session look at https://solid.inrupt.com/get-a-solid-pod"
    login_btn.style.display = "block"
    logout_btn.style.display = "none"
    session.login()
  }
}
</script>
</body>
</html>
```

## sh.note
when you get an instance (with pod.pti) of shortClass "Notes" and once you are logged with sh.session

- sh.notes.get(instance) return Array
- (sh.notes.subjects.get(instance) return Array) ??
- sh.notes.create(webId) return success/error
- sh.notes.remove(webId) return success/error
- sh.notes.update(webId) return success/error
- sh.notes.delete(webId) return success/error

## chat
- [see sh.chat live example](https://scenaristeur.github.io/shighl/instances.html)
when you get an instance (with pod.pti) of shortClass "LongChat" and once you are logged with sh.session
```
let chat = new sh.chat()
chat.instance = instance
let chat_details = await chat.init
info.innerHTML = JSON.stringify(chat_details)
let messages = await chat.messages
messages_liste.innerHTML = JSON.stringify(messages)
```

- [x] chat.init
- [x] chat.messages
- [x] chat.send({content: content, webId: webId, postType: postType, replyTo: replyTo})

- sh.chat.messages.get(date) return Array
- sh.chat.message.send({creator: webId, content:content} )
- sh.chat.message.reply(parentMessageUrl)

## friends
- sh.friends.get() return Array
- sh.friends.create(webId) return success/error
- sh.friends.remove(webId) return success/error
- sh.friends.update(webId) return success/error
- sh.friends.delete(webId) return success/error

## inbox
- sh.inbox.get(webId)
- sh.inbox.get.messages(inbox)
- sh.inbox.send.message()

## bookmark
- sh.bookmarks.get(instance) return Array
- sh.bookmarks.create(webId) return success/error
- sh.bookmarks.remove(webId) return success/error
- sh.bookmarks.update(webId) return success/error
- sh.bookmarks.delete(webId) return success/error

## hola (Holacratie)
- sh.hola.tension.create
...



# shighl
S-olid HIGH L-evel

- Some facilities to interact with a Solid POD
- based on ldflex-query

# use it in your project ? just copy  /dist/window/shighl.bundle.js to tour folder and import with
```
<script src="./vendor/solid-auth-client.bundle.js"></script>
<script src="./vendor/solid-query-ldflex.bundle.js"></script>
<script src="./window/shighl.bundle.js"></script>
<script>
const sh = new Shighl()
sh.test()
</script>
```
# or import
```
npm install --save scenaristeur/shighl
```

```
import  Shighl  from 'shighl'
...
const sh = new Shighl()
sh.test()
```

then you should see the result of this test

```
async test(){
  var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
  console.log(`${name}`);
  return `${name}`
}
```

see /dist/index.html

- Hosted on a POD : https://shighl.solid.community/public/demo/demo.html
- Hosted on ges : https://scenaristeur.github.io/shighl/

# Based



# Local install

```
git clone https://github.com/scenaristeur/shighl.git
cd shighl
npm install
npm run start

```
# Basic Usage

```
<!doctype html>
<html lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
<title>Shighl</title>
<script src="./vendor/solid-auth-client.bundle.js"></script>
<script src="./vendor/solid-query-ldflex.bundle.js"></script>
<script src="./window/shighl.bundle.js"></script>
</head>
<body>

<h1>Shigh</h1>
<ul id="friends">
</ul>

</body>

<script>

const sh = new Shighl()
console.log(sh)
sh.test()

async function run(){
  let friends  = await sh.getFriends("https://spoggy.solid.community/profile/card#me")
  console.log(friends)
  const friends_ul = document.getElementById("friends")
  friends.forEach(function(f){
    var li = document.createElement("LI")
    var t = document.createTextNode(f.webId);
    li.appendChild(t);
    friends_ul.appendChild(li)
    })
  }

  run()

  </script>
  </html>
  ```

  # Loading from https://cdn.jsdelivr.net

  ```

  <!doctype html>
  <html lang="en">
  <head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
  <title>Shighl</title>
  <!--   <link rel="shortcut icon" type="image/png" href="favicon.png">
  <link rel="manifest" href="./manifest.json">

  <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" >
  <link href="css/fontawesome/css/all.css" rel="stylesheet">
  <script src="vendor/jquery/jquery.slim.min.js"></script>-->
  <script src="https://cdn.jsdelivr.net/gh/scenaristeur/shighl@master/dist/vendor/solid-auth-client.bundle.js"> </script>
  <script src="https://cdn.jsdelivr.net/gh/scenaristeur/shighl@master/dist/vendor/solid-query-ldflex.bundle.js"> </script>
  <script src="https://cdn.jsdelivr.net/gh/scenaristeur/shighl@master/dist/window/shighl.bundle.js"> </script>
  </head>
  <body>

  <h1>Shigh</h1>
  <ul id="friends">
  </ul>

  </body>

  <script>

  const sh = new Shighl()
  console.log(sh)
  sh.test()

  async function run(){
    let friends  = await sh.getFriends("https://spoggy.solid.community/profile/card#me")
    console.log(friends)
    const friends_ul = document.getElementById("friends")
    friends.forEach(function(f){
      var li = document.createElement("LI")
      var t = document.createTextNode(f.webId);
      li.appendChild(t);
      friends_ul.appendChild(li)
      })
    }

    run()


    </script>

    </html>

    ```


    # Functionnalities
    - General
    - [ X ] Session : trackSession() / login() / logout () / getWebId() return webId/null
    <a href="https://scenaristeur.github.io/shighl/tracksession-login-logout.html" target="_blank">Session</a>

    - Profile
    - [ X ] getName(webId) return String
    - [ X ] getPhoto(webId) return String
    - [ X ] getFriends(webId) return Array of friends (String)
    - [ X ] getPublicTypeIndex(webId) return String / Array of instances (Objects) with props subject, predicate, object, classe, shortClass
    <a href="https://scenaristeur.github.io/shighl/profile.html" target="_blank">Profile</a>

    - publicTypeIndex
    - [ ] (? getDetails(webId) return Object)

    - LongChat
    - [ ] getFolder(publicTypeIndex) return String
    - [ ] getPath(folder) return String
    - [ ] getMessages(path) return Array of Messages
    - [ ] getDetails(messageUrl) return Object

    - Inbox
    - [ ] getInbox() return String
    - [ ] getMessages(inbox) return Array (with basic details ?)
    - [ ] getDetails(messageUrl) return Object/Array
    - [ ] sendMessage(inbox_dest) return result/error

    - Acl
    - [ ] getAcl(path) return Array

    # chat calendar
    show only days when there are messages
    https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input/date


    templates bootstrap https://bootsnipp.com/tags/chat

    # webpack build copied from @jeffz https://jeff-zucker.github.io/solid-file-client

    - build & publish to ges
    ```
    npm run build  
    git subtree push --prefix dist origin gh-pages


    ```

    https://blog.jakoblind.no/webpack-code-splitting-libraries-what-to-do-with-the-files/
    - build ldflex-query
    https://gist.github.com/bellbind/24d9a5851397d45e4fa83fa8ec30449c
    https://git.happy-dev.fr/startinblox/framework/sib-store/blob/master/package.json
