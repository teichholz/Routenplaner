const fs = require('fs');
const fsPromises = fs.promises;

async function readGoogleApiKey() {
    let key;
    try {
        let file = await fsPromises.readFile('./api.key', "utf-8");
        key = JSON.parse(file);
    } catch (err) {
        console.log(err);
    }
    return key.google;
}

async function fetchGoogleResult(){

}