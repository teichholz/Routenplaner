const mongo = require("mongodb").MongoClient;
const assert = require("assert");
const url = "mongodb://localhost:27017/";

class db{
/*         #url = "";
        #db = "";
        #collection = ""; */
    constructor(url, db, collection){
        this.url = url;
        this.db = db;
        this.collection = collection;
    }
    /**
     * Fuegt ein Dokument ein
     * - document: Ein JSON-Objekt
     */
    async insert(document){
        assert(typeof document == "object");
        const client = await mongo.connect(url);
        client.db(this.db).collection(this.collection).insert(documents);
        client.close();
    }

    /**
     * Fuegt ein Array von Dokumenten ein
     * - documents: Ein Array von JSON-Objekten
     */
    async insertMany(documents){
        assert(Array.isArray(documents));
        const client = await mongo.connect(url);
        client.db(this.db).collection(this.collection).insertMany(documents);
        client.close();
    }

    async queryAll(){
        const client = await mongo.connect(url, {useNewUrlParser: true});
        const cursor = yield client.db(this.db).collection(this.collection).find({}).toArray();
        client.close();
        return cursor;
    }
}

let dbCon = new db(url, "swt", "user");
console.log(dbCon.queryAll());

/* dbCon.queryAll().then((value) =>{
    console.log(value)
}); */
