'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pgSQL = require('pg');
const { move } = require('superagent');
// const constructors = require('./constructors.js');
const app = express();
const client = new pgSQL.Client(process.env.DATABASE_URL)
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

app.get('/yelp',(request,response)=>{
    const city = request.query.search_query;
    const url = `https://api.yelp.com/v3/businesses/search?latitude=${Location.all[0].latitude}&longitude=${Location.all[0].longitude}`
      const API_KEY = process.env.YELP_API_KEY;
      return superagent
        .get(url)
        .set({ "Authorization": `Bearer ${API_KEY}`})
        .then(result => {
            const allYelps = result.body.businesses.map(data => {
              return new Yelp(data);
            });
            response.send(allYelps);
        })
        .catch(error => console.log(error));
})


app.get('/location', (req, res) => {
    let city = req.query.city;
    let myQuery = `SELECT * FROM LOCATIONS WHERE search_query = '${city.toUpperCase()}';`;
    client.query(myQuery).then(result => {
        if (result.rows.length > 0) {
            console.log(result.rows[0].display_name);
            const dbLocation = new Location(result.rows);
            console.log(dbLocation);
            res.status(200).send(dbLocation);
            console.log('Hi this is going well so far');
        } else {
            let locationKey = process.env.LOCATIONKEY;
            let url = `https://eu1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
            superagent.get(url).then(geoData => {
                Location.all = [];
                const locationData = new Location(geoData.body,'location');
                let mySQL = 'INSERT INTO LOCATIONS VALUES($1,$2,$3,$4);'
                let safeValues = [
                    Location.all[0].search_query.toUpperCase(),
                    Location.all[0].formatted_query,
                    Location.all[0].latitude,
                    Location.all[0].longitude
                ]
                client.query(mySQL, safeValues).then(() => {
                    console.log('row inserted..............');
                    res.status(200).json(locationData);
                });
            });
        }
    });
});


app.get('/movies',(req,res) =>{
    let city = req.query.search_query;
    Movie.all =[];
    const movieKey = process.env.MOVIE_API_KEY;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${city}&language=en-US`
    superagent.get(url)
    .then(movieData =>{
         movieData.body.results.forEach(element => {
        new constructors(element,'movies');
        });
        res.status(200).send(Movie.all)
    });
});



app.get('/weather', (req, res) => {
    Weather.all= [];
    const keyWeather = process.env.WEATHERKEY;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${Location.all[0].latitude}&lon=${Location.all[0].longitude}&key=${keyWeather}`
    superagent.get(url)
    .then(weatherData =>{
        for (let index = 0; index < weatherData.body.data.length; index++) { // res.send(weatherData.data[index])
             new Weather(weatherData.body.data[index],'weather');
        }
        res.status(200).send(Weather.all)
        
    })
});


app.get('/trails', (req, res) => {
    Trail.all= [];
    let city = req.query.city;
    const keyTrails = process.env.TRAILSKEY;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${Location.all[0].latitude}&lon=${Location.all[0].longitude}&key=${keyTrails}`
    superagent.get(url)
    .then(trailsData =>{
        for (let index = 0; index < trailsData.body.trails.length; index++) { // res.send(weatherData.data[index])
            console.log(trailsData.body.trails[index]);
             new Trail(trailsData.body.trails[index],'trails');
        }
        res.status(200).send(Trail.all)
        
    })
});


app.get('*', (req, res) => {
    res.status(404).send(req + ' is not found');
});


app.use((error, req, res) => {
    res.status(500).send(error);
});


client.connect().then(() => {
    app.listen(PORT, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('I am listining to port: ', PORT);
    });
});
