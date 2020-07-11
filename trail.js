'use strict';
const superagent = require('superagent');

const client = require('./DBconnection.js')

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
}

function getTrails(req,res){
    let city = req.query.city;
    const keyTrails = process.env.TRAILSKEY;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&key=${keyTrails}`
    superagent.get(url)
    .then(trailsData =>{
        let result =  trailsData.body.trails.map((member,idx) =>{
            // if(idx<8){
                return new Trail(member);
            // }
        });
        res.status(200).send(result)
        
    })
}
module.exports = getTrails;