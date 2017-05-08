var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var faker = require('faker')
var ramdom = require('randomstring')

var pgp = require('pg-promise')();

var async = require('async');

var cn ={
    host:'localhost',
    port: 5432,
    database: 'demo',
    user: 'postgres',
    password:'14020234'
}
var db= pgp(cn);
var arrayFunc= [];

for (let i=0;i<50000000;i++){
    function func(callback) {
        var airport_code= ramdom.generate({
            length: 3,
            uppercase: true
        })
        var airport_name =faker.name.findName();
        var city= faker.address.city();
        var longitude = faker.random.number();
        var latitude = faker.random.number();
        var timezone = faker.date.past();

        db.one('INSERT INTO bookings.airports(airport_code, airport_name, city, longitude, latitude, timezone) VALUES($1, $2, $3, $4, $5, $6) RETURNING city,airport_code',
            [airport_code,airport_name,city,longitude,latitude,timezone])
            .then(data => {
                callback(null,airport_code); // print new user id;
            })
            .catch(error => {
                callback(null,'existed')// print error;
            });
    }

    arrayFunc.push(func)
}

async.series(arrayFunc,function (err, result) {
    if (err){
        console.error(err);
    }else {
        console.log('----------------------------------------------------------')
        console.log(result)
    }
})

// for (let i=0;i<50000000;i++){
//     // var flight_no= 'PG0063';
//     // var scheduled_arrival= faker.date.past();
//     // var scheduled_departure= faker.date.past();
//     // var departure_airport = 'SKX';
//     // var arrival_airport ='SKX';
//     // var status = 'Arrived'
//     // var aircraft_code= 'CR2';
//     // var actual_departure= faker.date.past();
//     // var actual_arrival = faker.date.past();
//     // console.log(actual_arrival)
//
//     var airport_code= ramdom.generate({
//         length: 3,
//         uppercase: true
//     })
//     var airport_name =faker.name.findName();
//     var city= faker.address.city();
//     var longitude = faker.random.number();
//     var latitude = faker.random.number();
//     var timezone = faker.date.past();
//
//     // console.log(airport_code)
//     // console.log(airport_name)
//     // console.log(city)
//     // console.log(longitude)
//     // console.log(latitude)
//     // console.log(timezone)
//
//     db.one('INSERT INTO bookings.airports(airport_code, airport_name, city, longitude, latitude, timezone) VALUES($1, $2, $3, $4, $5, $6) RETURNING city,airport_code',
//         [airport_code,airport_name,city,longitude,latitude,timezone])
//         .then(data => {
//             console.log(data.airport_code); // print new user id;
//         })
//         .catch(error => {
//             console.log('ERROR:', error); // print error;
//         });
// }


var index = require('./routes/index');
var users = require('./routes/users');

var faker= require('faker');
var app = express();


app.use('/', index);
app.use('/users', users);

module.exports = app;
