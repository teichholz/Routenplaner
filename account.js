var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/swt';
mongoose.connect(url, {
    useNewUrlParser: true
});

class account {
    constructor() {
    }
    static async register(username,  email, passwort) {
        let register = {success: true};
        account.db.on('error', function(err){
            throw err;
        });
        account.db.once('open', async function () {
            let query = account.model.find({email: email, username: username});
            await query.exec()
            .then(function(success){
                //console.log(success);
                if(success.length === 0){
                    new account.model({
                        username: username,
                        email: email,
                        passwort: passwort
                    })
                    .save(function(err){
                        // if(err)
                        //     register.success = false;
                        register.success = true;
                    });
                }
                else
                    register.success = false;
            })
            .catch(function(err){
                throw err;
                // console.log(err);
                // register.success = false;
            });
        });
        return register;
    }
    static async login(username, passwort){
        let login = {success: true};
        account.db.on('error', function(err){
        });
        account.db.once('open', function () {
            let query = account.model.find({username: username, passwort: passwort});
            query.exec()
            .then(function(success){
                //console.log(success);
                if(success.length === 1){
                    console.log("eingeloggt");
                    return login;
                }
            })
            .catch(function(err){
                throw err;
            });
        });
    }
}
account.db = mongoose.connection;
account.schema = new mongoose.Schema({
                username: String,
                email: String,
                passwort: String
});
account.model = mongoose.model('Account', account.schema);



//account.register('tim3', 'eichholz', 'web3.de', '1234');
account.login('tim3', '1234');
module.exports = account;