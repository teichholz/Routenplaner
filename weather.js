
const fs = require('fs');
const fsPromises = fs.promises;
const fetch = require("cross-fetch").fetch;

class weather {
    constructor() {
        
    }
    static async readOpenWeatherAPIKey(){
        let key;
        try {
            let file = await fsPromises.readFile('./api.key', "utf-8");
            key = JSON.parse(file);
        } catch (err) {
            console.log(err);
        }
        return key.openWeatherAPI;
    }

  	async getCurrentWeatherByID( cityID ) {
  		var key = await weather.readOpenWeatherAPIKey();
        var url = 'https://api.openweathermap.org/data/2.5/weather?id=' + cityID + '&appid=' + key;
        return this.fetchURL(url);
	}
    async getCurrentWeatherByCityName( cityName ) {
        var key = await weather.readOpenWeatherAPIKey();
        var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key;
        return this.fetchURL(url);
    }
    //weather data for 5 days in 3h intervals
    async getWeatherForecastByCityName( cityName ) {
        var key = await weather.readOpenWeatherAPIKey();
        var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + key;
        return this.fetchURL(url);
    }
    async getWeatherForecastByID( cityID ) {
        var key = await weather.readOpenWeatherAPIKey();
        var url = 'https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=' + key;
        return this.fetchURL(url);
    }
    /* should work but needs paid access
    async getWeatherPeriodByName(cityName, numDays){
        var key = await weather.readOpenWeatherAPIKey();
        var url = 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + '&cnt=' + numDays + '&appid=' + key;
        return this.fetchURL(url);
    }*/
    async fetchURL(url){
        var key = await weather.readOpenWeatherAPIKey();
        let res;
        try {
            res = await fetch(url)
            .then(function(res) { return res.json() });
        } catch (err) {
            console.log("Fehler beim fetchen: " + err);
        }
        return res;
    }
}
/*
const test = new weather();
test.getWeatherTodayByCityName("Dortmund")
.then(function (value) {
      console.log(value);
  });
  */