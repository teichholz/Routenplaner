
const express = require("express");
const google = require("./../google.js");
const account = require("./../account.js");
const restRoutes = express.Router();

restRoutes.get("/key/google", function(req, res){
    google.readGoogleApiKey()
    .then(function(key){
        res.send(key);
        res.end();
    })
    .catch(function(err){
        res.send({err: "key konnte nicht geladen werden"});
        res.end();
    });
});

//liefert poi's mit gewissem Radius und evtl. weiteren anderen Eigenschaften
//Zum aufraufen auf Clientseite asynchrone Funktionen benutzen
//Kommunikation koennte auch direkt vom Frotend an die google Server gehen
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
            res.send({err: "Fehler bei REST-Request"})
            res.end();
        })
    })
    .catch(function(err){
        res.send({err: "Fehler bei REST-Request"})
        res.end();
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
            res.send({err: "Fehler bei REST-Request"})
            res.end();
        })
    })
    .catch(function(err){
        res.send({err: "Fehler bei REST-Request"})
        res.end();
    });
});

//bester Weg zwischen 2 POI
restRoutes.post("/poi/distance", function(req, res){
    let g = new google("de", "Dortmund"); 
    let originLocation = req.body.origin; 
    let destinationLocation = req.body.destination; 
    const way = {
        origin: originLocation,
        destination: destinationLocation
    };

    g.fetchGoogleResult(g.distanceUrl(way))
    .then(function(response){
        res.send(response);
        res.end();
    })
    .catch(function(err){
        res.send({err: "Fehler bei REST-Request"})
        res.end();
    }); 

});

//Fuer Community routen, andere evt lokal speichern, POST
restRoutes.post("/route/community/anlegen", function(req, res){

});


restRoutes.post("/account/registrieren", function(req, res){
    const username = req.body.username;
    const passwort = req.body.passwort;
    const email = req.body.email;

    account.register(username, email, passwort)
    .then(function(status){
        res.send(status);
        res.end();
    })
    .catch(function(err){
        res.send({success: false});
        res.end();
    })
});

//Login ueber passport.js
// restRoutes.post("/account/login", function(req, res){
//     const username = req.body.username;
//     const passwort = req.body.passwort;

//     account.login(username, passwort)
//     .then(function(status){
//         res.end(status);
//     })
//     .catch(function(err){
//         res.end({success: false});
//     })
// });


module.exports = restRoutes;
