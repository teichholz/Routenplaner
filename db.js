const mongo = require("mongodb").MongoClient;
const assert = require("assert");
const url = "mongodb://localhost:27017/";

class db{
        #url = "";
        #db = "";
        #collection = "";
    constructor(url, db, collection){
        this.url = url;
        this.dbName = db;
        this.collection = collection;
    }
    /**
     * Fuegt ein Dokument ein
     * - document: Ein JSON-Objekt
     */
    async insert(document){
        assert(typeof document == "object");
        const client = await mongo.connect(url);
        const db = client.db(this.dbName)
        db.collection(this.collection).insertOne(document);
        client.close();
    }

    /**
     * Fuegt ein Array von Dokumenten ein
     * - documents: Ein Array von JSON-Objekten
     */
    async insertMany(documents){
        assert(Array.isArray(documents));
        const client = await mongo.connect(url);
        client.db(this.dbName).collection(this.collection).insertMany(documents);
        client.close();
    }

    async queryAll(){
        const dbName = this.dbName;
        (async function () {
            const client = await mongo.connect(url);
            const db = client.db(dbName);

            return db.collection(this.collection).find({});
        })().then(function (fullfilled) {
            return fullfilled;
        });
    }
}

let dbCon = new db(url, "swt", "user");
dbCon.insert({name: "Tim", nachname: "Eichhlz", alter:22});

console.log(dbCon.queryAll());
