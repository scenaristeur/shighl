import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
//import data from "@solid/query-ldflex/lib/exports/rdflib.js";
import { namedNode } from '@rdfjs/data-model';

/*
import { fetchDocument } from 'tripledoc';
import { foaf, rdfs, terms, solid } from 'rdf-namespaces';*/



class ShighlActivity {
  //  https://www.w3.org/TR/activitystreams-vocabulary/
  constructor () {
    console.log("Shighl Activity loaded")
  }



  set create(act){
    // https://www.w3.org/TR/activitystreams-vocabulary/#dfn-create
    return (async () => {
      console.log("CREATE", act)


    })();
  }





}

export default ShighlActivity
