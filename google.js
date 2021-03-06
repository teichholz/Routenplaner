const fs = require('fs');
const fsPromises = fs.promises;
const fetch = require("cross-fetch").fetch;

const fieldsDefault = {
    formatted_address: 1,
    geometry: 0,
    icon: 0,
    id: 1,
    name: 1,
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

const typesDefault = {
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
class gConnector{
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
    async googleNearbySearchUrl(fields, radius, location){
        fields = fields || fieldsDefault;
        const rad = radius;
        //location sind lat und long vom user
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
        
        const key = await gConnector.readGoogleApiKey();
        const fie = await gConnector.translateFields(fields);
        //const typ = await gConnector.translateTypes(types)
        //type fehlt noch

        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
              'key=' + key +
              '&location=' + loc.latitude + ',' + loc.longitude +
              '&radius=' + rad +
              fie +
              '&language=' + this.languageCode;
              //'&keyword=' + this.city;
        console.log(url);
        return url;
    }
    async detailsSearchUrl(id, fieldsUrl){
        const key = await gConnector.readGoogleApiKey();
        const fields = await gConnector.translateFields(fieldsUrl || fieldsDefault);
        const url = "https://maps.googleapis.com/maps/api/place/details/json?" +
                    "key=" + key +
                    "&placeid=" + id +
                    "&fields=" + fields +
                    "&language=" + this.languageCode;
        console.log(url);
        return url;
    }
    //Json mit origin, destination
    async distanceUrl(way){
        const key = await gConnector.readGoogleApiKey();
        const url = "https://maps.googleapis.com/maps/api/directions/json?" + 
        "key" + key +
        "&origin=" + way.origin
        "&destination=" + way.destination;
        return url;
    }
    async fetchGoogleResult(url) {
        let res;
        try {
            res = await fetch(await url);
        } catch (err) {
            console.log("Fehler beim fetchen: " + err);
        }
        //Im Auge behalten
        return res.json();
    }
}


// const g = new gConnector("de", "Dortmund");
module.exports =  gConnector;

// g.fetchGoogleResult(g.googleNearbySearchUrl(fields, 1000))
//  .then(function (result) {
//      return result.json();
//  })
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
