
const express = require("express");
const google = require("./../google.js");
const restRoutes = express.Router();

//liefert poi's mit gewissem Radius und evtl. weiteren anderen Eigenschaften
//Zum aufraufen auf Clientseite asynchrone Funktionen benutzen
restRoutes.get("/poi/get", function(req, res){
    //Parametern sollten ueber get uebergeben werden
    
    let g = new google("de", "Dortmund"); 
    //radius in km
    let radius = req.query.radius * 1000 || 10 * 1000;
    let location = req.query.location || 0;
    console.log(radius);
    //benutzt default felder
    let prom = g.fetchGoogleResult(g.googleNearbySearchUrl(null, radius, location));
    prom
    .then(function(response){
        //console.log(json);
        response.json()
        .then(function(data){
            res.send(data);
            res.end();
        })
        .catch(function(err){
            res.end({err: "Fehler bei REST-Request"});
        })
    })
    .catch(function(err){
        res.end({err: "Fehler bei REST-Request"});
    });
});

//Details zu einem POI
restRoutes.get("/poi/details", function(req, res){
    let g = new google("de", "Dortmund"); 
    let id = req.query.id;
    let prom = g.fetchGoogleResult(g.detailsSearchUrl(id));
    prom
    .then(function(response){
        //console.log(json);
        response.json()
        .then(function(data){
            res.send(data);
            res.end();
        })
        .catch(function(err){
            res.end({err: "Fehler bei REST-Request"});
        })
    })
    .catch(function(err){
        res.end({err: "Fehler bei REST-Request"});
    });
});

//bester Weg zwischen 2 POI
restRoutes.get("/poi/distance", function(req, res){
    
});

//Fuer Community routen, andere evt lokal speichern
restRoutes.post("/route/community/anlegen", function(req, res){

});


restRoutes.post("/account/registrieren", function(req, res){

});


module.exports = restRoutes;
