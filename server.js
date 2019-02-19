'use strict';

// Load environmnet variables from .env file
require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');

// Application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// API ROUTES
app.get('/location', (request, response) => {
  const locationData = searchToLatLong(request.query.data);
  response.send(locationData);
});

// Need a route so client can request weather data
// Only implement that AFTER you have "location" working
app.get('/weather', (request, response) => {
  const weatherData = getWeather(request.query.data);
  response.send(weatherData);
})

// Need a catch-all route that invokes handleError() if bad request comes in

// Make sure server is listening for requests
app.listen(PORT, () => console.log(`App is up on ${PORT}`));

// HELPER FUNCTIONS

// Error handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData);
  console.log('location in searchToLatLong()', location);
  return location;
}

function Location(query, res) {
  console.log('res in Location()', res);
  this.search_query = query;
  this.formatted_query = res.results[0].formatted_address;
  this.latitude = res.results[0].geometry.location.lat;
  this.longitude = res.results[0].geometry.location.lng;
}

function getWeather() {
  const darkskyData = require('./data/darksky.json');

  // Need to create an array, since we'll be returning an array of objects
  let weatherSummaries = [];
  
  // Need to iterate over our raw data  
  darkskyData.daily.data.forEach(day => {
    // Need to pass each object in the raw data through the constructor
    // Need to push the new instances into the array we just created
    weatherSummaries.push(new Weather(day));
  });
  // Return the array that's been filled with instances
  return weatherSummaries;
}

// Constructor needed for function getWeather()
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}
