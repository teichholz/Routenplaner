const express = require("express")();
const app = express();
const router = require("./routes/router.js")

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static("public"));
app.use("/", router);
// Letzte Middleware in der Kette. Behandelt den Fall das die Ressource nicht existiert
app.use(function(req, res){
    res.render('404', {
        url: req.url
    });
});

app.listen(8040, (err) => console.log("Server Lauscht auf localhost:8040"));
