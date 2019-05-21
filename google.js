const fs = require('fs');
const fsPromises = fs.promises;
const fetch = require("cross-fetch").fetch;

const fields = {
    formatted_address: 0,
    geometry: 0,
    icon: 0,
    id: 0,
    name: 1,
    permanently_closed: 0,
    photos: 0,
    place_id: 1,
    plus_code: 0,
    scope: 0,
    types: 0,
    price_level: 0,
    rating: 0,
    user_ratings_total: 0
};

const Detailsfields = {
    address_component: 1,
    adr_address: 1,
    alt_id: 1,
    formatted_address: 1,
    geometry: 1,
    icon: 1,
    id: 0,
    name: 0,
    permanently_closed: 0,
    photo: 0,
    place_id: 0,
    plus_code: 0,
    scope: 0,
    type: 0,
    url: 0,
    vicinity: 0,
    formatted_phone_number: 0,
    opening_hours: 0,
    website: 0,
    price_level: 0,
    rating: 0,
    review: 0,
    user_ratings_total: 0
};
const types = {
    cafe: 0,
    bank: 0,
    meal_takeaway: 0,
    meal_delivery: 0,
    museum: 0,
    shopping_mall: 0,
    zoo: 0,
    casino: 0,
    art_gallery: 0,
    aquarium: 0,
    amusement_park: 0,
    night_club: 0
}
export class gConnector{
    constructor(languageCode, city){
        this.languageCode = languageCode;
        this.city = city;
    }

    static async readGoogleApiKey(){
        let key;
        try {
            let file = await fsPromises.readFile('./api.key', "utf-8");
            key = JSON.parse(file);
        } catch (err) {
            console.log(err);
        }
        return key.google;
    }
    static async translateFields(fields){
        let str= "&fields="

        for (let pair of Object.entries(fields))
            if(pair[1] === 1)
                str += pair[0] + ",";
        return str.substring(0, str.length - 1);
    }
    static async translateTypes(types){
        let str= "&type="

        for (let pair of Object.entries(types))
            if(pair[1] === 1)
                str += pair[0] + ",";
        return str.substring(0, str.length - 1);
    }
    async cityGeocodeUrl(){
        const key = await gConnector.readGoogleApiKey();
        const url = 'https://maps.googleapis.com/maps/api/geocode/json?' +
              'address=' + this.city +
              "&key=" + key;
        return url;
    }
    async nearbySearchUrl(fields, radius, location){
        const rad = radius;
        const loc = location || await this.fetchGoogleResult(this.cityGeocodeUrl())
        .then(function(value){
            return value.json();
        })
        .then(function(value){
            return value.results[0].geometry.location;
        })
        .catch(function(err){
            console.log(err);
        });
        
        
        //results[0].geometry.location;
        const key = await gConnector.readGoogleApiKey();
        const fie = await gConnector.translateFields(fields);
        //type fehlt noch

        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
              'key=' + key +
              '&location=' + loc.lat + ',' + loc.lng +
              '&radius=' + rad +
              '&fields=' + fie +
              '&language=' + this.languageCode;
              //'&keyword=' + this.city;
        console.log(url);
        return url;
    }
    async detailsSearchUrl(id, fields){
        const key = await gConnector.readGoogleApiKey();
        const url = "https://maps.googleapis.com/maps/api/place/details/json?" +
                    "key" + key +
                    "&placeid" + id +
                    "&fields" + gConnector.translateFields(fields) +
                    "&language=" + this.languageCode;
        return url;
    }
    //Json mit origin, destination
    async distanceUrl(way){
        const key = await gConnector.readGoogleApiKey();
        const url = "https://maps.googleapis.com/maps/api/directions/json?" + 
        "key" + key +
        "&origin=" + way.origin
        "&destination=" + way.location;
        return url;
    }
    async fetchGoogleResult(url) {
        let res;
        try {
            res = await fetch(await url);
        } catch (err) {
            console.log("Fehler beim fetchen: " + err);
        }
        return res.json;
    }
}


module.exports = gConnector;
const g = new gConnector("de", "Dortmund");


// g.fetchGoogleResult(g.nearbySearchUrl(fields, 1000))
//  .then(function (value) {
//      console.log(value);
//  })
//  .catch(function (err) {
//      console.log(err);
//  });

// g.fetchGoogleResult(g.cityGeocodeUrl())
//  .then(function (value) {
//      return value.json();
//     })
//  .then(function (value) {
//      console.log(value.results[0].geometry.location);
//  })
//  .catch(function (err) {
//      console.log(err);
//  })
