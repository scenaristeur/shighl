///////////////////////////////////////////////////////////////////////////////
# What is a Shighl ?
- Shighl, is for S-olid high L-evel
- a tool that let you write simple html/js to interact with a Solid POD
- Session, Profile, Inbox, Chat...
- Source : https://github.com/scenaristeur/shighl/

# Qu'est-ce que Shighl ?
- Shighl, c'est pour S-olid high L-evel
- un outil qui vous permet d'écrire du simple html/js pour interagir avec un POD Solid
- Session, Profil, Messagerie, Chat...
- Source : https://github.com/scenaristeur/shighl/

///////////////////////////////////////////////////////////////////////////////


!! Help : I need some help to externalize ldflex-query form the webpack bundle. !!


# Shighl

## session
- sh.session.track() listen session changes
- sh.session.get() return webId/null
- sh.session.login() return webId if logged else opens login popup & return webId
- sh.session.logout() return success/error

## user / profile (test with getter & setter)
- get an instance of sh.user : let user = new sh.user(webId)
- example : let user = new sh.user("https://solidarity.inrupt.net/profile/card#me")
- then call user property user.name, user.photo...



- sh.user.name.get() return success/error
- sh.user.name.set(string)
- sh.user.publictypeindex.get(webId)
- sh.user.privatetypeindex.get(webId)
- sh.user.storage.get(webId)
- sh.user.getInstances(typeOfInstance)

## note
- sh.notes.get(instance) return Array
- (sh.notes.subjects.get(instance) return Array) ??
- sh.notes.create(webId) return success/error
- sh.notes.remove(webId) return success/error
- sh.notes.update(webId) return success/error
- sh.notes.delete(webId) return success/error

## chat
- sh.chat.get(instance) return Array
- (sh.chat.subjects.get(instance) return Array) ??
- sh.chat.calendar.get(instance) return {years: Array, months: Array, days: Array}
- sh.chat.messages.get(date) return Array
- sh.chat.message.detail(messageUrl)
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
<script src="window/shighl.bundle.js"> </script>
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
- Hosted on gh-pages : https://scenaristeur.github.io/shighl/

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
<script src="window/shighl.bundle.js"> </script>
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
- [ X ] getPublicTypeIndex(webId) return String / Array of instances (Objects) with props subject, predicate, object, classe, shortClasse
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

    templates bootstrap https://bootsnipp.com/tags/chat

    # webpack build copied from @jeffz https://jeff-zucker.github.io/solid-file-client

- build & publish to gh-pages
    npm run build && git subtree push --prefix dist origin gh-pages


    https://blog.jakoblind.no/webpack-code-splitting-libraries-what-to-do-with-the-files/
- build ldflex-query
    https://gist.github.com/bellbind/24d9a5851397d45e4fa83fa8ec30449c
    https://git.happy-dev.fr/startinblox/framework/sib-store/blob/master/package.json