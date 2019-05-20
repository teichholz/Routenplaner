const fs = require('fs');
const fsPromises = fs.promises;
const fetch = require("cross-fetch").fetch;

const fields = {
    formatted_address: 0,
    geometry: 0,
    icon: 0,
    id: 0,
    name: 0,
    permanently_closed: 0,
    photos: 0,
    place_id: 0,
    plus_code: 0,
    scope: 0,
    types: 0,
    price_level: 0,
    rating: 0,
    user_ratings_total: 0
};

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
        '&input=Koeln&inputtype=textquery&fields=name';
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


