const express = require("express");
const router = express.Router();


let routeHTML = function () {

    router.get("/",
        function (req, res, next) {
            res.render('index', {});
        });
}

routeHTML();
module.exports = router;
