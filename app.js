const express = require("express");
const app = express();
const router = require("./routes/router.js");
const rest = require("./routes/rest.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const account = require("./account.js");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

passport.use(new localStrategy(
  function (username, password, done) {
    console.log("in local strategy");
    
    account.model.findOne(
      {
        username: username,
        passwort: password
      }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect account.' });
        }
        // if (!user.validPassword(password)) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
        return done(null, user);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors());
app.use(express.static("public"));
app.use(passport.initialize());


app.use("/", router);
app.use("/", rest);

//Login via passport.js
app.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.

    //redirect nicht noetig da Angularfrontend
    //res.redirect('/users/' + req.user.username);
    console.log("authenticated");
    
    res.send({ login: true });
  });

// Letzte Middleware in der Kette. Behandelt den Fall das die Ressource nicht existiert
app.use(function (req, res) {
  res.render('404', {
    url: req.url
  });
});
app.listen(8080, (err) => console.log("Server Lauscht auf localhost:8080"));


// let d = new db('mongodb://localhost:27017/', "moritzDB", "accounts");
// let moritzAccount = new account("Moritz", "dasdasdasdas", "moritz97.s@web.de");
// d.insertOne(moritzAccount);
// d.insertOne({"Name":"Moritz", "Nachname":"Schäfer"});