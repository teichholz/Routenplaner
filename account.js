var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/swt';
mongoose.connect(url, {
    useNewUrlParser: true
});

class account {
    constructor() {
    }
    static register(name, nachname, email, passwort) {
        let errCode = 0; //Erfolg
        account.db.on('error', function(err){
            errCode = 3;
        });
        account.db.once('open', function () {
            let query = account.model.find({email: email, name: name});
            query.exec()
            .then(function(success){
                //console.log(success);
                if(success.length === 0){
                    var accountInstace = new account.model({
                        name: name,
                        nachname: nachname,
                        email: email,
                        passwort: passwort
                    })
                    .save(function(err){
                        if(err)
                            errCode = 1;
                    });
                }
                else
                    errCode = 2;
            })
            .catch(function(err){
                console.log(err);
                errCode = 4;
            });
        });
    }
    static login(name, passwort){
        account.db.on('error', function(err){
        });
        account.db.once('open', function () {
            let query = account.model.find({name: name, passwort: passwort});
            query.exec()
            .then(function(success){
                //console.log(success);
                if(success.length === 1){
                    console.log("eingeloggt");
                }
            })
            .catch(function(err){
                console.log(err);
            });
        });
    }
}
account.db = mongoose.connection;
account.schema = new mongoose.Schema({
                name: String,
                nachname: String,
                email: String,
                passwort: String
});
account.model = mongoose.model('Account', account.schema);



//account.register('tim3', 'eichholz', 'web3.de', '1234');
account.login('tim3', '1234');
module.exports = account;