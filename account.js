var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/swt';
mongoose.connect(url, {
    useNewUrlParser: true
});

class account {
    constructor() {
    }
    static async register(username, email, passwort) {
        console.log("in register");

        let register = { success: false };
        account.db.on('error', function (err) {
            throw err;
        });
        account.db.once('open', function () {
            console.log("openend");
        });

        let query = account.model.find({ email: email, username: username });
        query.exec()
            .then(function (success) {
                //console.log(success);
                if (success.length === 0) {
                    new account.model({
                        username: username,
                        email: email,
                        passwort: passwort
                    })
                        .save(function (err) {
                            // if(err)
                            //     register.success = false;
                            console.log("Account erstellt");

                            register.success = true;
                        });
                }
            })
            .catch(function (err) {
                throw err;
            });
        await register;
        return register;
    }
    static async login(username, passwort) {
        let login = { success: true };
        account.db.on('error', function (err) {
            throw err;
        });
        //once besagt das der even-handel deregestriert und ausgefuehrt wird.
        //nicht sinnvol in userem fal
        account.db.once('open', function () {
        });
        let query = account.model.find({ username: username, passwort: passwort });
        query.exec()
            .then(function (success) {
                //console.log(success);
                if (success.length === 1) {
                    console.log("eingeloggt");
                    return login;
                }
            })
            .catch(function (err) {
                throw err;
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



// account.register('tim5', 'web5.de', "1234");
// account.login('tim3', '1234');
module.exports = account;