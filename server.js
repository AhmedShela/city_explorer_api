'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const superagent = require('superagent');
// const pgSQL = require('pg');
const app = express();
// const client = new pgSQL.Client(process.env.DATABASE_URL)
app.use(cors());

const PORT = process.env.PORT || 3030;
// Location.all = [];
// function Location(city,dataOfCity) { // this.display_name = dataOfCity[0].display_name;
//     this.search_query = city;
//     this.formatted_query = dataOfCity[0].display_name;
//     this.latitude = dataOfCity[0].lat;
//     this.longitude = dataOfCity[0].lon;
//     Location.all.push(this)
// };
// Weather.all = [];
// function Weather(dataOfWeather) {
//     this.forecast = dataOfWeather.weather.description;
//     this.time = new Date(dataOfWeather.datetime).toDateString();
//     // this.time = new Date(dataOfWeather.datetime).toString().split(' ').slice(0, 4).join(' '); // another solution
//     Weather.all.push(this);
// }
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

Movie.all =[];
function Movie(dataOfMovie) {
    this.title = dataOfMovie.title;
    this.overview = dataOfMovie.overview;
    this.average_votes = dataOfMovie.vote_average;
    this.total_votes = dataOfMovie.vote_count;
    this.image_url =`https://image.tmdb.org/t/p/w500${dataOfMovie.poster_path}`; //((dataOfMovie.poster_path) ? dataOfMovie.poster_path : '');//if(!dataOfMovie.poster_path){''};
    this.popularity = dataOfMovie.popularity;
    this.released_on = dataOfMovie.release_date;
    Movie.all.push(this);
}
// Yelp.all = [];
function Yelp(dataOfYelp) {
    this.name = dataOfYelp.name;
    this.image_url = dataOfYelp.image_url;
    this.price = dataOfYelp.price;
    this.rating = dataOfYelp.rating;
    this.url = dataOfYelp.url;
    this.created_at = Date.now();
}

app.get('/', (req, res) => {
    res.status(200).send('YOUR DOING GREATE!!')
});

const myClient = require('./DBconnection.js')
myClient.connect().then(() => {
    app.listen(PORT, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('I am listining to port: ', PORT);
    });
});

const locationhandler = require('./location.js');
app.get('/location', locationhandler);


const myWeather = require('./weather.js');
app.get('/weather',myWeather);


const myTrails = require('./trail.js');
app.get('/trails',myTrails);


const myYelps = require('./yelp.js')
app.get('/yelp',myYelps)


const myMovie = require('./movie.js')
app.get('/movies',myMovie);


app.get('*', (req, res) => {
    res.status(404).send(req + ' is not found');
});


app.use((error, req, res) => {
    res.status(500).send(error);
});

