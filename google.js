const fs = require('fs');
const fsPromises = fs.promises;
const fetch = require("cross-fetch").fetch;

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

async function fetchGoogleResult() {
    const key = await readGoogleApiKey();
    const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?' +
        'key=' + key +
        '&input=Brandenburger%Tor&inputtype=textquery&fields=name';
    let res;
    try {
        res = await fetch(url);
    } catch (err) {
        console.log("Fehler beim fetchen: " + err);
    }
    return res;
}

fetchGoogleResult()
    .then((res) => {
        return res.json();
    })
    .then((json) => {
        console.log(json);
    })
    .catch((err) => {
        console.log("fehler: " + err);
    });