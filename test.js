'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pgSQL = require('pg');
const app = express();
const client = new pgSQL.Client(process.env.DATABASE_URL)
app.use(cors());

const PORT = process.env.PORT || 3030;
Location.all = [];
function Location(city, dataOfCity) { // this.display_name = dataOfCity[0].display_name;
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
    this.name = dataOfTrails.name;
    this.location = dataOfTrails.location;
    this.length = dataOfTrails.length;
    this.stars = dataOfTrails.stars;
    this.star_votes = dataOfTrails.starVotes;
    this.summary = dataOfTrails.summary;
    this.trail_url = dataOfTrails.url;
    this.conditions = dataOfTrails.conditionStatus;
    this.condition_date = new Date(dataOfTrails.conditionDate).toDateString();
    this.condition_time = new Date(dataOfTrails.conditionDate).toTimeString();
    Trail.all.push(this);
}

app.get('/location', (req, res) => {
    let city = req.query.city;
    let myQuery = `SELECT * FROM LOCATIONS WHERE search_query = '${city.toUpperCase()}';`;
    client.query(myQuery).then(result => {
        if (result.rows.length > 0) {
            console.log(result.rows[0]);
            const dbLocation = new Location(city, result.rows);
            res.status(200).send(dbLocation);
            console.log('Hi this is going well so far');
        } else {
            let locationKey = process.env.LOCATIONKEY;
            let url = `https://eu1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
            superagent.get(url).then(geoData => {
                Location.all = [];
                const locationData = new Location(city, geoData.body);
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

// app.get('/location', (req, res) => {
//     let city = req.query.city;
//     // check if exist in the DB;
//     let myQuery = `SELECT * FROM LOCATIONS WHERE search_query = '${city.toUpperCase()}';`;
//     console.log(myQuery);
//     client.query(myQuery).then(result => {
//         if (result.rows.length > 0) {
//             console.log(result.rows[0]);
//             const dbLocation = new Location(city, result.rows);
//             res.status(200).send(dbLocation);
//             console.log('Hi this is going well so far');
//         }
//     });
//     // if it is not it is goint to take it form the api;
//     let locationKey = process.env.LOCATIONKEY;
//     let url = `https://eu1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
//     superagent.get(url).then(geoData => {
//         Location.all = [];
//         // console.log('doesnt exist!!');
//         const locationData = new Location(city, geoData.body);
//         // insert the value to DB
//         let mySQL = 'INSERT INTO LOCATIONS VALUES($1,$2,$3,$4);'
//         let safeValues = [
//             Location.all[0].search_query.toUpperCase(),
//             Location.all[0].formatted_query,
//             Location.all[0].latitude,
//             Location.all[0].longitude
//         ]
//         client.query(mySQL,safeValues)
//         .then(()=>{
//             res.status(200).json(locationData);
//         });
//     });
// });


app.get('/weather', (req, res) => {
    Weather.all = [];
    const keyWeather = process.env.WEATHERKEY;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${
        Location.all[0].latitude
    }&lon=${
        Location.all[0].longitude
    }&key=${keyWeather}`

    superagent.get(url).then(weatherData => {
        for (let index = 0; index < weatherData.body.data.length; index++) { // res.send(weatherData.data[index])
            new Weather(weatherData.body.trails[index]);
        }
        res.status(200).send(Weather.all)

    })
})


app.get('/trails', (req, res) => {
    Trail.all = [];
    let city = req.query.city;
    const keyTrails = process.env.TRAILSKEY;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${
        Location.all[0].latitude
    }&lon=${
        Location.all[0].longitude
    }&maxDistance=10&key=${keyTrails}`

    superagent.get(url).then(trailsData => {

        for (let index = 0; index < trailsData.body.trails.length; index++) { // res.send(weatherData.data[index])
            console.log(trailsData.body.trails[index]);
            new Trail(trailsData.body.trails[index]);
        }
        res.status(200).send(Trail.all)

    })
})


app.get('/person', (req, res) => {
    client.query('select * from person').then(result => {
        res.status(200).send(result);
    });
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
