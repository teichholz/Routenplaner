
const express = require("express");
const google = require("./../google.js");
const restRoutes = express.Router();

//liefert poi's mit gewissem Radius und evtl. weiteren anderen Eigenschaften
//Zum aufraufen auf Clientseite asynchrone Funktionen benutzen
restRoutes.get("/poi/get", function(req, res){
    
});

//Fuer Community routen, andere evt lokal speichern
restRoutes.post("/route/community/anlegen", function(req, res){

});



module.exports = restRoutes;
