import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
//import data from "@solid/query-ldflex/lib/exports/rdflib.js";
import { namedNode } from '@rdfjs/data-model';
import { v4 as uuidv4 } from 'uuid';
// https://github.com/Otto-AA/solid-acl-utils

//import * as SolidAclUtils from 'solid-acl-utils/dist/browser/solid-acl-utils.bundle.js'
//console.log(SolidAclUtils)
import * as SolidFileClient from 'solid-file-client/dist/window/solid-file-client.bundle.js'

// You could also use SolidAclUtils.Permissions.READ instead of following
// This is just more convenient
//const { AclApi, AclDoc, AclParser, AclRule, Permissions, Agents } = SolidAclUtils
//const { READ, WRITE, APPEND, CONTROL } = Permissions

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
    module.inbox = inbox
    module.outbox = outbox
    // create folders
    if( !(await module.fc.itemExists(inbox)) ) {
      await module.fc.createFolder(inbox) // only create if it doesn't already exist
    }

    let aclInboxContent = `@prefix : <#>.
    @prefix acl: <http://www.w3.org/ns/auth/acl#>.
    @prefix inbox: <./>.
    @prefix c: </profile/card#>.

    :Append
    a acl:Authorization;
    acl:accessTo <./>;
    acl:agentClass acl:AuthenticatedAgent;
    acl:default <./>;
    acl:defaultForNew <./>;
    acl:mode acl:Append.
    :ControlReadWrite
    a acl:Authorization;
    acl:accessTo <./>;
    acl:agent c:me;
    acl:default <./>;
    acl:defaultForNew <./>;
    acl:mode acl:Control, acl:Read, acl:Write.
    :Read
    a acl:Authorization;
    acl:accessTo <./>;
    acl:default <./>;
    acl:defaultForNew <./>;
    acl:mode acl:Read.`

    let file = root+"inbox/.acl"
    await module.fc.createFile (file, aclInboxContent, "text/turtle") .then (success => {
      console.log (`Created ${file} .`)
    }, err => console.log (err));

    if( !(await module.fc.itemExists(outbox)) ) {
      await module.fc.createFolder(outbox) // only create if it doesn't already exist
    }

    if( !(await module.fc.itemExists(outbox+"objects/")) ) {
      await module.fc.createFolder(outbox+"objects/") // only create if it doesn't already exist
    }
    if( !(await module.fc.itemExists(outbox+"activities/")) ) {
      await module.fc.createFolder(outbox+"activities/") // only create if it doesn't already exist
    }





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
    await data[inst_index].as$inbox.add(namedNode(inbox))
    await data[inst_index].as$outbox.set(namedNode(outbox))

  }

  getPath(pod){
    return (async () => {
      let path
      let pti = await pod.pti
      pti.instances.forEach((inst, i) => {
        //  console.log(inst)
        if (inst.instance.endsWith("#Shighl") && (inst.classe == "https://www.w3.org/ns/activitystreams#Collection") ){
          //instance = inst
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

  get messages(){
    return (async () => {
      console.log("ACTIVITY",this)
      let folder = await this.fc.readFolder(this.inbox)
      let messages = folder.files.map(f => f.url);
      return messages
    })();
  }

  getInboxMessageDetail(url){
    return (async () => {
      let messUrl = url+"#this"
      let message = {}
      let type = await data[messUrl]['https://www.w3.org/ns/activitystreams#type']
      let attributedTo = await data[messUrl]['https://www.w3.org/ns/activitystreams#attributedTo']
      message.attributedTo = attributedTo
      message.label = await data[messUrl].rdfs$label
      message.link = await data[messUrl].as$link
      let published = new Date(await data[messUrl].as$published)
      message.published = published.toLocaleString(navigator.language)
      message.timestamp = published.getTime()
      message.summary = await data[messUrl].as$summary
      message.senderName = await data[message.attributedTo].vcard$fn || `${message.attributedTo}`.split("/")[2].split('.')[0];
      message.senderPhoto = await data[message.attributedTo].vcard$hasPhoto || ""
      message.type = `${type}`
      //  console.log("ME", message)
      return message
    })();
  }


  set create(act){
    let module = this
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
        let outbox = await data[path+"index.ttl#this"].as$outbox

        console.log( "Must get OUTBOX", `${outbox}`)
        // first object
        /*<http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671>
        a as:Note ;
        as:content "Guten Tag!"@de, "Good day!"@en, "Grüezi"@gsw, "Bun di!"@roh .*/
        let dateObj = new Date();
        let date = dateObj.toISOString()
        let to = act.object.target == "Public" ? "https://www.w3.org/ns/activitystreams#Public" : act.object.target;

        //object create
        let object_Id = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        //    let object_uri = outbox+"objects/"+object_Id+"/index.ttl#this"
        let object_file = outbox+"objects/"+object_Id+".ttl"

        let object_uri = object_file+"#this"

        await data[object_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#'+act.object.type))
        await data[object_uri]['https://www.w3.org/ns/activitystreams#name'].add(act.object.name)
        await data[object_uri]['https://www.w3.org/ns/activitystreams#content'].add(act.object.content)
        await data[object_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
        await data[object_uri]['https://www.w3.org/ns/activitystreams#to'].add(namedNode(to))
        await data[object_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(act.actor.id))
        // inReplyTo ?

        //activity create
        let activity_Id = uuidv4();
        //      let activity_uri = outbox+"activities/"+activity_Id+"/index.ttl#this"
        let activity_file = outbox+"activities/"+activity_Id+".ttl"
        let activity_uri = activity_file+"#this"

        await data[activity_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#'+act.type))
        await data[activity_uri]['https://www.w3.org/ns/activitystreams#target'].add(namedNode(to))
        await data[activity_uri]['https://www.w3.org/ns/activitystreams#summary'].add(act.summary)
        await data[activity_uri]['https://www.w3.org/ns/activitystreams#object'].add(namedNode(object_uri))
        await data[activity_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
        await data[activity_uri].rdfs$label.add(act.summary)


        let aclOutboxObject = `@prefix : <#>.
        @prefix acl: <http://www.w3.org/ns/auth/acl#>.
        @prefix c: </profile/card#>.

        :ControlReadWrite
        a acl:Authorization;
        acl:accessTo <${object_file}>;
        acl:agent c:me;
        acl:mode acl:Control, acl:Read, acl:Write.
        :Read
        a acl:Authorization;
        acl:accessTo <${object_file}>;
        acl:agent <${to}>;
        acl:mode acl:Read.`

        let aclOutboxObjectPublic = `
        @prefix : <#>.
        @prefix acl: <http://www.w3.org/ns/auth/acl#>.
        @prefix c: </profile/card#>.
        @prefix n1: <http://xmlns.com/foaf/0.1/>.

        :ControlReadWrite
        a acl:Authorization;
        acl:accessTo <${object_file}>;
        acl:agent c:me;
        acl:mode acl:Control, acl:Read, acl:Write.
        :Read
        a acl:Authorization;
        acl:accessTo <${object_file}>;
        acl:agentClass n1:Agent;
        acl:mode acl:Read.
        `



        let aclObjectFile = object_file+".acl"

        if (act.object.target == "Public"){
          await module.fc.createFile (aclObjectFile, aclOutboxObjectPublic, "text/turtle") .then (success => {
            console.log (`Created ${aclObjectFile} .`)
          }, err => console.log (err));
        }else{
          await module.fc.createFile (aclObjectFile, aclOutboxObjectPublic, "text/turtle") .then (success => {
            console.log (`Created ${aclObjectFile} .`)
          }, err => console.log (err));
        }





        let aclOutboxActivity = `@prefix : <#>.
        @prefix acl: <http://www.w3.org/ns/auth/acl#>.
        @prefix c: </profile/card#>.

        :ControlReadWrite
        a acl:Authorization;
        acl:accessTo <${activity_file}>;
        acl:agent c:me;
        acl:mode acl:Control, acl:Read, acl:Write.
        :Read
        a acl:Authorization;
        acl:accessTo <${activity_file}>;
        acl:agent <${to}>;
        acl:mode acl:Read.`


        let aclOutboxActivityPublic = `
        @prefix : <#>.
        @prefix acl: <http://www.w3.org/ns/auth/acl#>.
        @prefix c: </profile/card#>.
        @prefix n1: <http://xmlns.com/foaf/0.1/>.

        :ControlReadWrite
        a acl:Authorization;
        acl:accessTo <${activity_file}>;
        acl:agent c:me;
        acl:mode acl:Control, acl:Read, acl:Write.
        :Read
        a acl:Authorization;
        acl:accessTo <${activity_file}>;
        acl:agentClass n1:Agent;
        acl:mode acl:Read.
        `



        let aclActivityFile = activity_file+".acl"
        if (act.object.target == "Public"){
          await module.fc.createFile (aclActivityFile, aclOutboxActivityPublic, "text/turtle") .then (success => {
            console.log (`Created ${aclActivityFile} .`)
          }, err => console.log (err));
        }else{
          await module.fc.createFile (aclActivityFile, aclOutboxActivity, "text/turtle") .then (success => {
            console.log (`Created ${aclActivityFile} .`)
          }, err => console.log (err));
        }






        // recipient notification
        let notification_Id = uuidv4();
        if (to == "https://www.w3.org/ns/activitystreams#Public"){
          console.log("Send to Agora")
          to = "https://agora.solid.community/profile/card#me"
        }
        let pod_recip = new sh.pod()
        pod_recip.webId = to
        //        console.log(pod)
        let path_recip = await this.getPath(pod_recip)
        //        console.log(path)
        let recip_inbox = await data[path_recip+"index.ttl#this"].as$inbox
        //        let notification_uri = recip_inbox+notification_Id+"/index.ttl#this"
        let notification_uri = recip_inbox+notification_Id+".ttl#this"

        console.log(notification_uri)
        await data[notification_uri]['https://www.w3.org/ns/activitystreams#type'].add(namedNode('https://www.w3.org/ns/activitystreams#'+act.type))
        await data[notification_uri]['https://www.w3.org/ns/activitystreams#attributedTo'].add(namedNode(act.actor.id))
        await data[notification_uri]['https://www.w3.org/ns/activitystreams#summary'].add(act.summary)
        await data[notification_uri].rdfs$label.add(act.summary)
        await data[notification_uri]['https://www.w3.org/ns/activitystreams#published'].add(date)
        await data[notification_uri]['https://www.w3.org/ns/activitystreams#link'].add(namedNode(activity_uri))






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


  /*  let aclInboxContent = '@prefix acl: <http://www.w3.org/ns/auth/acl#>.\ n' +
  '@prefix c: </profile/card#>.\ n \ n' +

  '# The owner has all permissions\ n' +
  '<#owner>\ n' +
  '    a acl:Authorization;\ n' +
  '    acl:agent c:me;\ n' +
  '    acl:accessTo <./>;\ n' +
  '    acl:defaultForNew <./>;\ n' +
  '    acl:mode acl:Read, acl:Write, acl:Control.'*/

  /*let aclInboxContentOK = '# ACL resource for the public folder \n' +
  '@prefix acl: <http://www.w3.org/ns/auth/acl#>. \n' +
  '@prefix foaf: <http://xmlns.com/foaf/0.1/>. \n\n' +
  '# The owner has all permissions\n' +
  '<#owner>\n' +
  '    a acl:Authorization;\n' +
  '    acl:agent <https://spoggy-test.solid.community/profile/card#me>;\n' +
  '    acl:accessTo <./>;\n' +
  '    acl:default <./>;\n' +
  '    acl:defaultForNew <./>;\n' +
  '    acl:mode acl:Read, acl:Write, acl:Control.\n\n' +
  '# The public has read permissions\n' +
  '<#public>\n' +
  '    a acl:Authorization;\n' +
  '    acl:agentClass foaf:Agent;\n' +
  '    acl:accessTo <./>;\n' +
  '    acl:default <./>;\n' +
  '    acl:defaultForNew <./>;\n' +
  '    acl:mode acl:Read.'*/

  /*
  // Passing it the fetch from solid-auth-client
  const fetch = auth.fetch.bind(auth)

  //  const aclApi_outbox = new AclApi(fetch, { autoSave: true })
  const aclApi_inbox = new AclApi(fetch, { autoSave: true })

  //  const acl_outbox = await aclApi_outbox.loadFromFileUrl(outbox)
  const acl_inbox = await aclApi_inbox.loadFromFileUrl(inbox)
  */

  // Note: Workaround, because currently no default permissions are copied when a new acl file is created. Not doing this could result in having no CONTROL permissions after the first acl.addRule call
  /*if (!acl_outbox.hasRule(Permissions.ALL, webId)) {
  await acl_outbox.addRule(Permissions.ALL, webId)
}*/
/*
if (!acl_inbox.hasRule(Permissions.ALL, webId)) {
await acl_inbox.addRule(Permissions.ALL, webId)
}
*/
//INBOX RULES
//owner
/*
if (!  await acl_inbox.hasRule(CONTROL, webId)) {
await acl_inbox.addRule(CONTROL, webId)
}
if (!  await acl_inbox.hasRule(WRITE, webId)) {
await acl_inbox.addRule(WRITE, webId)
}
if (!  await acl_inbox.hasRule(READ, webId)) {
await acl_inbox.addRule(READ, webId)
}
await acl_inbox.deleteRule(APPEND, webId)

//authenticated as Submitter
if (!  await acl_inbox.hasRule(APPEND, Agents.AUTHENTICATED)) {
await acl_inbox.addRule(APPEND, Agents.AUTHENTICATED)
}
await acl_inbox.deleteRule(READ, Agents.AUTHENTICATED)
await acl_inbox.deleteRule(WRITE, Agents.AUTHENTICATED)
await acl_inbox.deleteRule(CONTROL, Agents.AUTHENTICATED)

//public none
await acl_inbox.deleteRule(READ, Agents.PUBLIC)
await acl_inbox.deleteRule(APPEND, Agents.PUBLIC)
await acl_inbox.deleteRule(WRITE, Agents.PUBLIC)
await acl_inbox.deleteRule(CONTROL, Agents.PUBLIC)
*/
// TODO : ajouter l'appli
/*
@prefix : <#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix inbox: <./>.
@prefix c: </profile/card#>.

:Append
a n0:Authorization;
n0:accessTo inbox:;
n0:agentClass n0:AuthenticatedAgent;
n0:mode n0:Append.
:AppendDefault
a n0:Authorization;
n0:agentClass n0:AuthenticatedAgent;
n0:default inbox:;
n0:mode n0:Append;
n0:origin <http://localhost:9000>.
:ControlReadWrite
a n0:Authorization;
n0:accessTo inbox:;
n0:agent c:me;
n0:mode n0:Control, n0:Read, n0:Write.
*/


/*# ACL resource for the private folder
@prefix acl: <http://www.w3.org/ns/auth/acl#>.
@prefix c: </profile/card#>.

# The owner has all permissions
<#owner>
a acl:Authorization;
acl:agent c:me;
acl:accessTo <./>;
acl:defaultForNew <./>;
acl:mode acl:Read, acl:Write, acl:Control.
*/


/*
@prefix : <#>.
@prefix acl: <http://www.w3.org/ns/auth/acl#>.
@prefix inbox: <./>.
@prefix c: </profile/card#>.

:Append
a acl:Authorization;
acl:accessTo <./>;
acl:agentClass acl:AuthenticatedAgent;
acl:default <./>;
acl:defaultForNew <./>;
acl:mode acl:Append.
:ControlReadWrite
a acl:Authorization;
acl:accessTo <./>;
acl:agent c:me;
acl:default <./>;
acl:defaultForNew <./>;
acl:mode acl:Control, acl:Read, acl:Write.
:Read
a acl:Authorization;
acl:accessTo <./>;
acl:default <./>;
acl:defaultForNew <./>;
acl:mode acl:Read.
*/
/*
const agentsInboxA = acl_inbox.getAgentsWith(APPEND)
console.log(agentsInboxA.hasPublic())
console.log(agentsInboxA.hasAuthenticated()) // Authenticated means everyone who is logged in

const agentsInboxR = acl_inbox.getAgentsWith(READ)
console.log(agentsInboxR.hasPublic())
console.log(agentsInboxR.hasAuthenticated()) // Authenticated means everyone who is logged in
*/



}

export default ShighlActivity
