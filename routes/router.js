const express = require("express");
const router = express.Router();


let routeHTML = function () {
    let geoLocation = null;

    router.get("/",
               function (req, res, next) {
                   res.render('index', {});
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
