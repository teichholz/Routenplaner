const express = require("express");
const google = require("./../google.js");
const router = express.Router();


let routeHTML = function () {
    let geoLocation = null;

    router.get("/",
               function (req, res, next) {
                   res.render('index', {});
               });

    router.get("/map",
               function (req, res, next) {
                    const key = google.readGoogleApiKey();
                    key
                    .then(function(value){
                    const url = "https://maps.googleapis.com/maps/api/js?key=" + value + "&callback=initMap";
                        res.render('map', {url: url});
                    })
                    .catch(function(err){
                        res.render("map", {err: 42});
                    });

               });

    router.post("/setLocation",
         function (req, res, next) {
             geoLocation = req.body;
         });

    router.get("/location",
               function (req, res, next) {
                   res.render("location", {geoLocation})
               });
}

routeHTML();
module.exports = router;
