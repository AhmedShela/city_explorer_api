'use strict';

const superagent = require('superagent');

const client = require('./DBconnection.js')

function getMovie(req,res) {
    let city = req.query.search_query;
    const movieKey = process.env.MOVIE_API_KEY;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${city}&language=en-US`
    superagent.get(url)
    .then(movieData =>{
        const allMovies = movieData.body.results.map(data => {
            return new Movie(data);
          });
        res.status(200).send(allMovies)
    });
}

function Movie(dataOfMovie) {
    this.title = dataOfMovie.title;
    this.overview = dataOfMovie.overview;
    this.average_votes = dataOfMovie.vote_average;
    this.total_votes = dataOfMovie.vote_count;
    this.image_url =`https://image.tmdb.org/t/p/w500${dataOfMovie.poster_path}`; //((dataOfMovie.poster_path) ? dataOfMovie.poster_path : '');//if(!dataOfMovie.poster_path){''};
    this.popularity = dataOfMovie.popularity;
    this.released_on = dataOfMovie.release_date;
}
module.exports = getMovie;