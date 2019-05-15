var mongo = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/swt";

let db = function(url){
    this.url = url;

    
};

mongo.connect(url, {useNewUrlParser: true}, function (err, db){
    if(err) throw err;
    console.log("Mit Datenbank verbunden");

    let dbo = db.db("swt");
    let obj = {name: "tim", nachname: "eichholz2"};
    dbo.collection("swt").insertOne(obj, function(err, res){
        if(err) throw err;
        console.log("eingefuegt");
    });
    db.close();
});