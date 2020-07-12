'use strict';

const superagent = require('superagent');

const client = require('./DBconnection.js')

function getYlps(request,response) {
    const city = request.query.search_query;
    const url = `https://api.yelp.com/v3/businesses/search?latitude=${request.query.latitude}&longitude=${request.query.longitude}`
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
}

function Yelp(dataOfYelp) {
    this.name = dataOfYelp.name;
    this.image_url = dataOfYelp.image_url;
    this.price = dataOfYelp.price;
    this.rating = dataOfYelp.rating;
    this.url = dataOfYelp.url;
    this.created_at = Date.now();
}
module.exports = getYlps;