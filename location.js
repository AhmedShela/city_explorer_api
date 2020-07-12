'use strict';
const superagent = require('superagent');

const client = require('./DBconnection.js')


function Location(city, dataOfCity) {
    this.search_query = city;
    this.formatted_query = dataOfCity[0].display_name;
    this.latitude = dataOfCity[0].lat;
    this.longitude = dataOfCity[0].lon;
};

function getLocations(req, res) {
    let city = req.query.city;
    let myQuery = `SELECT * FROM LOCATIONS WHERE search_query = '${city.toUpperCase()}';`;
    client.query(myQuery).then(result => {
        if (result.rows.length > 0) {
            const dbLocation = new Location(city, result.rows);
            res.status(200).send(dbLocation);
        } else {
            let locationKey = process.env.LOCATIONKEY;
            let url = `https://eu1.locationiq.com/v1/search.php?key=${locationKey}&q=${city}&format=json`;
            superagent.get(url).then(geoData => {
                const locationData = new Location(city, geoData.body);
                let mySQL = 'INSERT INTO LOCATIONS VALUES($1,$2,$3,$4);'
                let safeValues = [locationData.search_query.toUpperCase(), locationData.formatted_query, locationData.latitude, locationData.longitude]
                client.query(mySQL, safeValues).then(() => {
                    res.status(200).json(locationData);
                });
            });
        }
    });
}

module.exports = getLocations;
