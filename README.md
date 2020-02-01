!! Help : I need some help to externalize ldflex-query form the webpack bundle. !!

# shighl
S-olid HIGH L-evel

- Some facilities to interact with a Solid POD
- based on ldflex-query
- use it in your project ? just copy  /dist/window/shighl.bundle.js to tour folder and import with
```
  <script src="window/shighl.bundle.js"> </script>
  <script>
  const sh = new Shighl()
  console.log(sh)
  sh.test()
  </script>
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





# webpack build copied from @jeffz https://jeff-zucker.github.io/solid-file-client

- build & publish to gh-pages
npm run build && git subtree push --prefix dist origin gh-pages
