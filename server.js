'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3030;

function Location(dataOfCity) { // this.display_name = dataOfCity[0].display_name;
    this.search_query = dataOfCity[0].type;
    this.formatted_query = dataOfCity[0].display_name;
    this.latitude = dataOfCity[0].lon;
    this.longitude = dataOfCity[0].lat;
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
app.get('/', (req, res) => {
    res.status(200).send('YOUR DOING GREATE!!')
});
app.get('/location', (req, res) => {
    let city = req.query.city;
    const cityData = require('./data/location.json')
    let result = new Location(cityData)
    res.send(result)
});
app.get('/weather', (req, res) => {
    let weather = req.query.city;
    const weatherData = require('./data/weather.json')
    for (let index = 0; index < weatherData.data.length; index++) { // res.send(weatherData.data[index])
        let result = new Weather(weatherData.data[index]);
    }
    res.send(Weather.all)
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
