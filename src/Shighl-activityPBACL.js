import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
//import data from "@solid/query-ldflex/lib/exports/rdflib.js";
import { namedNode } from '@rdfjs/data-model';

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

  async testacl(webId, root){
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

    // Passing it the fetch from solid-auth-client
    const fetch = auth.fetch.bind(auth)

    const aclApi = new AclApi(fetch, { autoSave: true })

    const acl_outbox = await aclApi.loadFromFileUrl(outbox)
    const acl_inbox = await aclApi.loadFromFileUrl(inbox)


    // Note: Workaround, because currently no default permissions are copied when a new acl file is created. Not doing this could result in having no CONTROL permissions after the first acl.addRule call
    if (!acl_outbox.hasRule(Permissions.ALL, webId)) {
      await acl_outbox.addRule(Permissions.ALL, webId)
    }

    if (!acl_inbox.hasRule(Permissions.ALL, webId)) {
      await acl_inbox.addRule(Permissions.ALL, webId)
    }

  //  await acl_outbox.addRule(APPEND, Agents.AUTHENTICATED)
    await acl_outbox.deleteRule(READ, Agents.PUBLIC)
    const agentsOutbox = acl_outbox.getAgentsWith(APPEND)
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

  }



  /* https://gitlab.com/openengiadina/cpub/-/blob/develop/docs/example.org
  <http://localhost:4000/activities/e4ad4f99-e1ab-44e7-ba68-2c8af87cb021>
  a as:Create ;
  as:actor <http://localhost:4000/users/alice> ;
  as:object <http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671> ;
  as:published "2020-03-23T08:13:49"^^xsd:dateTime ;
  as:to <http://localhost:4000/users/bob> .

  <http://localhost:4000/objects/76c0cba2-f4f0-4b68-96cc-6048e5712671>
  a as:Note ;
  as:content "Guten Tag!"@de, "Good day!"@en, "Grüezi"@gsw, "Bun di!"@roh .

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



  set create(act){
    // https://www.w3.org/TR/activitystreams-vocabulary/#dfn-create
    return (async () => {
      console.log("CREATE", act)







    })();
  }





}

export default ShighlActivity
