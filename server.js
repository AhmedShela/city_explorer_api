'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3030;
Location.all = [];
function Location(city,dataOfCity) { // this.display_name = dataOfCity[0].display_name;
    this.search_query = city;
    this.formatted_query = dataOfCity[0].display_name;
    this.latitude = dataOfCity[0].lat;
    this.longitude = dataOfCity[0].lon;
    Location.all.push(this)
};
Weather.all = [];
function Weather(dataOfWeather) {
    // "forecast": "Partly cloudy until afternoon.",
    // "time": "Mon Jan 01 2001"
    this.forecast = dataOfWeather.weather.description;
    this.time = new Date(dataOfWeather.datetime).toDateString();
    // this.time = new Date(dataOfWeather.datetime).toString().split(' ').slice(0, 4).join(' '); // another solution
    Weather.all.push(this);
}
Trail.all = [];
function Trail(dataOfTrails) {
    this.name= dataOfTrails.name;
    this.location = dataOfTrails.location;
    this.length =dataOfTrails.length;
    this.stars = dataOfTrails.stars;
    this.star_votes = dataOfTrails.starVotes;
    this.summary = dataOfTrails.summary;
    this.trail_url = dataOfTrails.url;
    this.conditions = dataOfTrails.conditionStatus;
    this.condition_date = new Date(dataOfTrails.conditionDate).toDateString();
    this.condition_time = new Date(dataOfTrails.conditionDate).toTimeString();
    Trail.all.push(this);
}

app.get('/', (req, res) => {
    res.status(200).send('YOUR DOING GREATE!!')
});
app.get('/location', (req, res) => {
    let city = req.query.city;
    // const cityData = require('./data/location.json')
    let locationKey = process.env.LOCATIONKEY;
    // let url  = `GET https://us1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
    let url = `https://eu1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
    // let result = new Location(city,cityData)
        superagent.get(url)
        .then(geoData => {
            console.log('inside superagent');
            // console.log(geoData.body);
            Location.all = [];
            const locationData = new Location(city, geoData.body);
            // console.log(locationData);
            res.status(200).json(locationData);
        });
    // superagent.get(url)
    // .then(locationDate =>{
    //     let result = new Location(city,locationDate)
    //     res.status(200).send(result)
    // })
    // res.status(200).send(result)
});
app.get('/weather', (req, res) => {
    // let weather = req.query.city;
    Weather.all = [];
    // let city = req.query.city;
    const keyWeather = process.env.WEATHERKEY;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${Location.all[0].latitude}&lon=${Location.all[0].longitude}&key=${keyWeather}`
    // const weatherData = require('./data/weather.json')
    superagent.get(url)
    .then(weatherData =>{
        // res.status(200).send(weatherData.body.data);
        for (let index = 0; index < weatherData.body.data.length; index++) { // res.send(weatherData.data[index])
             new Weather(weatherData.body.data[index]);
        }
        res.status(200).send(Weather.all)
        
    })
})

app.get('/trails', (req, res) => {
    // let weather = req.query.city;
    Weather.all = [];
    let city = req.query.city;
    const keyTrails = process.env.TRAILSKEY;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${Location.all[0].latitude}&lon=${Location.all[0].longitude}&maxDistance=10&key=${keyTrails}`
    // const weatherData = require('./data/weather.json')
    superagent.get(url)
    .then(trailsData =>{
        // res.status(200).send(trailsData.body.trails[0].name);
        for (let index = 0; index < trailsData.body.trails.length; index++) { // res.send(weatherData.data[index])
            console.log(trailsData.body.trails[index]);
             new Trail(trailsData.body.trails[index]);
        }
        res.status(200).send(Trail.all)
        
    })
})

app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});

app.use((error, req, res) => {
    res.status(500).send(error);
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return
    }
    console.log('I am listining to port: ', PORT);
});
