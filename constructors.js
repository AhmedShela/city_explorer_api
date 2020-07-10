'use strict';
const pgSQL = require('pg');
const client = new pgSQL.Client(process.env.DATABASE_URL);
const superagent = require('superagent');

var allLocation = [];
const Location = function(city,dataOfCity) { // this.display_name = dataOfCity[0].display_name;
    this.search_query = city;
    this.formatted_query = dataOfCity[0].display_name;
    this.latitude = dataOfCity[0].lat;
    this.longitude = dataOfCity[0].lon;
    allLocation.push(this)
};
let mylocations = function getLocation(req, res,city){
    let requist = req;
    let resonse = res;
    let mycity = city;
    let myQuery = `SELECT * FROM LOCATIONS WHERE search_query = '${mycity}';`;
   return client.query(myQuery).then(result => {
        if (result.rows.length > 0) {
            // console.log(result.rows[0]);
            const dbLocation = new Location(city,result.rows);
            // console.log(dbLocation);
        //    return resonse.status(200).send(dbLocation);
              return dbLocation;
            // console.log('Hi this is going well so far');
        } else {
        //     let locationKey = process.env.LOCATIONKEY;
        //     let url = `https://eu1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
        //    return superagent.get(url).then(geoData => {
        //         constructors.allLocation = [];
        //         const locationData = new constructors(geoData.body,'location');
        //         let mySQL = 'INSERT INTO LOCATIONS VALUES($1,$2,$3,$4);'
        //         let safeValues = [
        //             constructors.allLocation[0].search_query,
        //             constructors.allLocation[0].formatted_query,
        //             constructors.allLocation[0].latitude,
        //             constructors.allLocation[0].longitude
        //         ]
        //         client.query(mySQL, safeValues).then(() => {
        //             // console.log('row inserted..............');
        //         //    return resonse.status(200).json(locationData);
        //               return locationData;
        //         });
        //     });
        }
    });
}
var allWeather = [];
// const Weather = function(dataOfWeather) {
//     this.forecast = dataOfWeather.weather.description;
//     this.time = new Date(dataOfWeather.datetime).toDateString();
//     // this.time = new Date(dataOfWeather.datetime).toString().split(' ').slice(0, 4).join(' '); // another solution
//     allWeather.push(this);
// }
var allTrail= [];
// const Trail =function(dataOfTrails) {
//     this.name= dataOfTrails.name;
//     this.location = dataOfTrails.location;
//     this.length =dataOfTrails.length;
//     this.stars = dataOfTrails.stars;
//     this.star_votes = dataOfTrails.starVotes;
//     this.summary = dataOfTrails.summary;
//     this.trail_url = dataOfTrails.url;
//     this.conditions = dataOfTrails.conditionStatus;
//     this.condition_date = new Date(dataOfTrails.conditionDate).toDateString();
//     this.condition_time = new Date(dataOfTrails.conditionDate).toTimeString();
//     allTrail.push(this);
// }
var allMovie =[];
// const Movie = function(dataOfMovie) {
//     this.title = dataOfMovie.title;
//     this.overview = dataOfMovie.overview;
//     this.average_votes = dataOfMovie.vote_average;
//     this.total_votes = dataOfMovie.vote_count;
//     this.image_url =`https://image.tmdb.org/t/p/w500${dataOfMovie.poster_path}`; //((dataOfMovie.poster_path) ? dataOfMovie.poster_path : '');//if(!dataOfMovie.poster_path){''};
//     this.popularity = dataOfMovie.popularity;
//     this.released_on = dataOfMovie.release_date;
//     allMovie.push(this);
// }
// const Yelp = function(dataOfYelp) {
//     this.name = dataOfYelp.name;
//     this.image_url = dataOfYelp.image_url;
//     this.price = dataOfYelp.price;
//     this.rating = dataOfYelp.rating;
//     this.url = dataOfYelp.url;
//     this.created_at = Date.now();
// }

// const AllData = function(data,trans) {
// switch (trans) {
//     case 'locations':
//         this.search_query = city;
//         this.formatted_query = data[0].display_name;
//         this.latitude = data[0].lat;
//         this.longitude = data[0].lon;
//         allLocation.push(this)
//         break;
//     case 'weather' :
//         this.forecast = data.weather.description;
//         this.time = new Date(data.datetime).toDateString();
//         // this.time = new Date(dataOfWeather.datetime).toString().split(' ').slice(0, 4).join(' '); // another solution
//         allWeather.push(this);
//         break;
//     case 'trails':
//         this.name= data.name;
//         this.location = data.location;
//         this.length =data.length;
//         this.stars = data.stars;
//         this.star_votes = data.starVotes;
//         this.summary = data.summary;
//         this.trail_url = data.url;
//         this.conditions = data.conditionStatus;
//         this.condition_date = new Date(data.conditionDate).toDateString();
//         this.condition_time = new Date(data.conditionDate).toTimeString();
//         allTrail.push(this);
//         break;
//     case 'movies':
//         this.title = data.title;
//         this.overview = data.overview;
//         this.average_votes = data.vote_average;
//         this.total_votes = data.vote_count;
//         this.image_url =`https://image.tmdb.org/t/p/w500${data.poster_path}`; //((data.poster_path) ? data.poster_path : '');//if(!data.poster_path){''};
//         this.popularity = data.popularity;
//         this.released_on = data.release_date;
//         allMovie.push(this);
//         break;
//     case 'yelp':
//         this.name = data.name;
//         this.image_url = data.image_url;
//         this.price = data.price;
//         this.rating = data.rating;
//         this.url = data.url;
//         this.created_at = Date.now();
//         break;
// }
// }
module.exports.mylocations = mylocations; 