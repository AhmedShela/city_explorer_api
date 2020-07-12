'use strict';
const superagent = require('superagent');

const client = require('./DBconnection.js')

function Weather(dataOfWeather) {
    this.forecast = dataOfWeather.weather.description;
    this.time = new Date(dataOfWeather.datetime).toDateString();
    // this.time = new Date(dataOfWeather.datetime).toString().split(' ').slice(0, 4).join(' '); // another solution
}

function getWeather(req,res){
    const keyWeather = process.env.WEATHERKEY;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.query.latitude}&lon=${req.query.longitude}&key=${keyWeather}`
    superagent.get(url)
    .then(weatherData =>{
        let result =  weatherData.body.data.map((member,idx) =>{
            // if(idx<8){
                return new Weather(member);
            // }
        });
        res.status(200).send(result)
        
    })
}

module.exports = getWeather;