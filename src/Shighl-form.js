import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';
import { ShighlFormInput } from './form/shighl-form-input.js'

class ShighlHola {
  constructor (root) {

    this.root = root
    console.log("Shighl FORM loaded for element with id : ",root)
    //this.webId = null
    console.log("shexCore", shexCore)
    console.log("shexLoader", shexLoader)
    console.log("shexParser", shexParser)
    console.log("ShExJison", ShExJison)
  }

  get shape_url() {
    return this._shape_url
  }

  set shape_url(shape_url) {
    this._shape_url = shape_url
    this.load_schema(shape_url)
  }

  async load_schema(shape_url){
    let app = this
    shexLoader.load([shape_url], [], [], []).then(loaded => {
      if (loaded.schema){
        //console.log("LOADED",loaded.schema)
        //app.schema = JSON.stringify(loaded.schema);
        app.splitSchema(loaded.schema)
      }
    }, err => {
      console.log("erreur ",err)
      alert(err.message)
    }
  );
}


async splitSchema(schema){
  var app = this;
  this.shapes = []
  this.footprint_shapes = []
  this.translate_shapes = []
  //console.log("shapes", schema.shapes)
  schema.shapes.forEach((shape, i) => {
    if(shape.id.endsWith("_Footprint")){
      shape.use = "footprint"
      this.footprint_shapes.push(shape)
    } else if(shape.id.endsWith("_Translate")){
      shape.use = "translate"
      app.translate_shapes.push(shape)
    }  else {
      shape.use = "regular"
      app.shapes.push(shape)
    }
  });
  this.currentShape = this.shapes[0]
  this.rootElement = document.getElementById(this.root)
  console.log("ROOT Element",this.rootElement)
  this.initRootElement()
  this.shapes.forEach((shape, i) => {
    this.initShape(shape)
  });

  console.log("SHAPES",this.shapes)
  console.log("FOOTPRINT_SHAPES",this.footprint_shapes)
  console.log("TRANSLATE_SHAPES",this.translate_shapes)

}

initRootElement(){
  this.rootElement.innerHTML = ""
  this.tab = document.createElement("DIV")
  this.tab.className = "tab"
  this.tab.setAttribute("id", "tab")
  this.rootElement.appendChild(this.tab)
}

initShape(shape, root = document.getElementById(this.root)){
  let app = this
  //  console.log(shape.type, shape.expression, shape.id, root)
  switch (shape.type) {
    case "Shape":
    //  <button class="tablinks" onclick="openCity(event, 'London')">London</button>
    let btn = document.createElement("BUTTON")
    btn.className = "tablinks"
    btn.textContent = app.localName(shape.id);
    btn.onclick = function(){
      //alert('here be dragons');
      app.openShape(event, shape)
      return false;
    };
    this.tab.appendChild(btn)
    /*<div id="London" class="tabcontent">
    <h3>London</h3>
    <p>London is the capital city of England.</p>
    </div>*/
    let shapeDiv = document.createElement("DIV")
    shapeDiv.setAttribute("id", shape.id)
    shapeDiv.className = "tabcontent"
    shapeDiv.innerHTML = shape.id
    this.rootElement.appendChild(shapeDiv)
    this.convertExpression(shape.expression, shapeDiv)
    var b = document.createElement('button');
    b.setAttribute('content', 'test content');
    b.setAttribute('class', 'btn');
    b.textContent = 'Save '+app.localName(shape.id);
    shapeDiv.appendChild(b)
    break;
    default:

  }

}

convertExpression(expression, parent){

  console.log(expression, parent)
  switch (expression.type) {
    case "EachOf":
    //  console.log(expression)
    expression.expressions.forEach((e, i) => {
      console.log(e)
      this.convertExpression(e,parent)
    });
    break;
    case "TripleConstraint":
    console.log(expression)
    let hrT = document.createElement("HR")
    parent.appendChild(hrT)
    let pred = document.createElement("DIV")
    pred.innerHTML = expression.predicate
    parent.appendChild(pred)

    let valueExpr= document.createElement("DIV")
    valueExpr.innerHTML = JSON.stringify(expression.valueExpr)
    parent.appendChild(valueExpr)

    let min= document.createElement("DIV")
    min.innerHTML = "min: "+expression.min
    parent.appendChild(min)

    let max= document.createElement("DIV")
    max.innerHTML = "max: "+expression.max
    parent.appendChild(max)


    //<popup-info img="img/alt.png" data-text="Your card validation code (CVC) is an extra security feature — it is the last 3 or 4 numbers on the back of your card."></popup-info>
    let pop = document.createElement("shighl-form-input")
    pop.setAttribute("text", "hello")
    parent.appendChild(pop)


    /*
    let defT = document.createElement("DIV")
    defT.innerHTML = "TRIPLECONSTRAINT : "+JSON.stringify(expression)
    parent.appendChild(defT)*/





    break;
    default:
    let hr = document.createElement("HR")
    parent.appendChild(hr)
    let def = document.createElement("DIV")
    def.innerHTML = "TODO : "+expression.type+JSON.stringify(expression)
    parent.appendChild(def)

  }
}

openShape(evt, shape) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(shape.id).style.display = "block";
  evt.currentTarget.className += " active";
}

localName(uri){
  var ln = uri;
  if (uri.lastIndexOf("#") != -1) {
    ln = uri.substr(uri.lastIndexOf("#")).substr(1)
  }else{
    ln = uri.substr(uri.lastIndexOf("/")).substr(1)
  }
  return ln
}

async test(){
  var name = await data['https://spoggy.solid.community/profile/card#me'].vcard$fn
  console.log(`${name}`);
}

}

export default ShighlHola
