import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
//import data from "@solid/query-ldflex/lib/exports/rdflib.js";
import { namedNode } from '@rdfjs/data-model';
import { v4 as uuidv4 } from 'uuid';
// https://github.com/Otto-AA/solid-acl-utils

import * as SolidAclUtils from 'solid-acl-utils/dist/browser/solid-acl-utils.bundle.js'
console.log(SolidAclUtils)
import * as SolidFileClient from 'solid-file-client/dist/window/solid-file-client.bundle.js'

// You could also use SolidAclUtils.Permissions.READ instead of following
// This is just more convenient
const { AclApi, AclDoc, AclParser, AclRule, Permissions, Agents } = SolidAclUtils
const { READ, WRITE, APPEND, CONTROL } = Permissions

class ShighlActivity {
  //  https://www.w3.org/TR/activitystreams-vocabulary/
  constructor () {
    console.log("Shighl Activity loaded")
    this.fc   = new SolidFileClient(auth)
    //  this.testacl()
  }

  async testacl(pod, root){
    let webId = pod.webId
    //  console.log(webid)
    let module = this

    let inbox = root+'inbox/'
    let outbox = root+'outbox/'
    // create folders
    if( !(await module.fc.itemExists(inbox)) ) {
      await module.fc.createFolder(inbox) // only create if it doesn't already exist
    }

    if( !(await module.fc.itemExists(outbox)) ) {
      await module.fc.createFolder(outbox) // only create if it doesn't already exist
    }

    if( !(await module.fc.itemExists(outbox+"objects/")) ) {
      await module.fc.createFolder(outbox+"objects/") // only create if it doesn't already exist
    }
    if( !(await module.fc.itemExists(outbox+"activities/")) ) {
      await module.fc.createFolder(outbox+"activities/") // only create if it doesn't already exist
    }
    /*
    // Passing it the fetch from solid-auth-client
    const fetch = auth.fetch.bind(auth)

    const aclApi_outbox = new AclApi(fetch, { autoSave: true })
    const aclApi_inbox = new AclApi(fetch, { autoSave: true })

    const acl_outbox = await aclApi_outbox.loadFromFileUrl(outbox)
    const acl_inbox = await aclApi_inbox.loadFromFileUrl(inbox)


    // Note: Workaround, because currently no default permissions are copied when a new acl file is created. Not doing this could result in having no CONTROL permissions after the first acl.addRule call
    if (!acl_outbox.hasRule(Permissions.ALL, webId)) {
    await acl_outbox.addRule(Permissions.ALL, webId)
  }

  if (!acl_inbox.hasRule(Permissions.ALL, webId)) {
  await acl_inbox.addRule(Permissions.ALL, webId)
}

await acl_outbox.addRule(READ, Agents.AUTHENTICATED)
await acl_outbox.deleteRule(READ, Agents.PUBLIC)
const agentsOutbox = acl_outbox.getAgentsWith(READ)
console.log([...agentsOutbox.webIds]) // array containing all webIds which have write access
console.log([...agentsOutbox.groups])
console.log(agentsOutbox.hasPublic())
console.log(agentsOutbox.hasAuthenticated()) // Authenticated means everyone who is logged in

await acl_inbox.addRule(APPEND, Agents.AUTHENTICATED)
await acl_inbox.deleteRule(READ, Agents.PUBLIC)

const agentsInbox = acl_inbox.getAgentsWith(APPEND)
console.log([...agentsInbox.webIds]) // array containing all webIds which have write access
console.log([...agentsInbox.groups])
console.log(agentsInbox.hasPublic())
console.log(agentsInbox.hasAuthenticated()) // Authenticated means everyone who is logged in
*/
// create pti entry
//console.log()
let pti = await pod.pti
let pti_url = pti.url
//  var dateObj = new Date();
//  let id = "#Sh"+dateObj.getTime()
let id = "#Shighl"
let inst_uri = pti_url+id
let inst_index = root+'index.ttl#this'
console.log("inst uri",inst_uri)
await data[inst_uri].solid$forClass.add(namedNode('https://www.w3.org/ns/activitystreams#Collection'))
await data[inst_uri].solid$instance.set(namedNode(inst_index))
//  await data[inst_uri].rdfs$label.add("Activity Streams Collection")
await data[inst_index].solid$inbox.add(namedNode(inbox))
await data[inst_index].solid$outbox.set(namedNode(outbox))

}

getPath(pod){
  return (async () => {
    let path
    let pti = await pod.pti
    pti.instances.forEach((inst, i) => {
      //  console.log(inst)
      if (inst.instance.endsWith("#Shighl") && (inst.classe == "https://www.w3.org/ns/activitystreams#Collection") ){
        instance = inst
        //  console.log("INST url",instance.url)
        path = inst.url.substr(0, inst.url.lastIndexOf('/') + 1);
        //console.log("PATH 1", path)
      }
    });
    //console.log("PATH 2", path)
    if (path == undefined){
      path = await pod.storage+"public/shighl_test/"
    }
    //console.log("PATH 3", path)
    return path
  })();
}


set create(act){
  //    https://raw.githubusercontent.com/w3c/activitypub/gh-pages/activitypub-tutorial.txt
  // https://www.w3.org/TR/activitystreams-vocabulary/#dfn-create
  //https://blog.joinmastodon.org/2018/06/how-to-implement-a-basic-activitypub-server/
  return (async () => {
    console.log("CREATE", act)
    //    console.log("OUTBOX")
    // target : webId
    let actorId = act.actor.id
    if (typeof actorId  == "string"){
      //        console.log(actorId)
      let sh = new Shighl()
      let pod = new sh.pod()
      pod.webId = actorId
      //        console.log(pod)
      let path = await this.getPath(pod)
      //        console.log(path)
      let outbox = await data[path+"index.ttl#this"].solid$outbox

      console.log( "Must get OUTBOX", `${outbox}`)
      // first object
      /*<http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671>
      a as:Note ;
      as:content "Guten Tag!"@de, "Good day!"@en, "Grüezi"@gsw, "Bun di!"@roh .*/
      let dateObj = new Date();
      let date = dateObj.toISOString()
      let to = act.object.target == "Public" ? "https://www.w3.org/ns/activitystreams#Public" : act.object.target;

      let object_Id = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
      let object_uri = outbox+"objects/"+object_Id+"/index.ttl#this"
      await data[object_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#'+act.object.type))
      await data[object_uri]['https://www.w3.org/ns/activitystreams#name'].add(act.object.name)
      await data[object_uri]['https://www.w3.org/ns/activitystreams#content'].add(act.object.content)
      await data[object_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
      await data[object_uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode(to))
      await data[object_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(act.actor.id))
      // inReplyTo ?

      let activity_Id = uuidv4();
      let activity_uri = outbox+"activities/"+activity_Id+"/index.ttl#this"
      await data[activity_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#'+act.type))
      await data[activity_uri]['https://www.w3.org/ns/activitystreams#target'].add(namedNode(to))
      await data[activity_uri]['https://www.w3.org/ns/activitystreams#summary'].add(act.summary)
      await data[activity_uri]['https://www.w3.org/ns/activitystreams#object'].add(namedNode(object_uri))
      await data[activity_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)

      /* https://gitlab.com/openengiadina/cpub/-/blob/develop/docs/example.org
      <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021>
      a as:Create ;
      as:actor <http://localhost:4000/users/alice> ;
      as:object <http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671> ;
      as:published "2020-03-23T08:13:49"^^xsd:dateTime ;
      as:to <http://localhost:4000/users/bob> .



      /////////////
      alice outbox
      <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021>
      a as:Create ;
      as:actor <http://localhost:4000/users/alice> ;
      as:object <http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671> ;
      as:published "2020-03-23T08:13:49"^^xsd:dateTime ;
      as:to <http://localhost:4000/users/bob> .

      <http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671>
      a as:Note ;
      as:content "Guten Tag!"@de, "Good day!"@en, "Grüezi"@gsw, "Bun di!"@roh .

      <http://localhost:4000/users/alice/outbox>
      a ldp:BasicContainer, as:Collection ;
      ldp:member <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021> ;
      as:items <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021> .

      /////////
      bob inbox

      <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021>
      a as:Create ;
      as:actor <http://localhost:4000/users/alice> ;
      as:object <http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671> ;
      as:published "2020-03-23T08:13:49"^^xsd:dateTime ;
      as:to <http://localhost:4000/users/bob> .

      <http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671>
      a as:Note ;
      as:content "Guten Tag!"@de, "Good day!"@en, "Grüezi"@gsw, "Bun di!"@roh .

      <http://localhost:4000/users/bob/inbox>
      a ldp:BasicContainer, as:Collection ;
      ldp:member <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021> ;
      as:items <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021> .


      */



    }else{
      //target : { Person}
      console.log("todo : target{Person}")
    }


    /*
    console.log("INBOX or agora", act.target)
    console.log(typeof act.target )*/


  })();
}





}

export default ShighlActivity
