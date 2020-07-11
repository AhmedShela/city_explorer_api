'use strict';

const pgSQL = require('pg');

const client = new pgSQL.Client(process.env.DATABASE_URL)

module.exports = client;

//P.S : the DB Client requirement has to be in the same file so all the other moduls can reach the same database connection