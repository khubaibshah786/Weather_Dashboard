
// var apiKey = '7aef1906e93e8116cc215bc5377288b3'
// var apiCall = 'http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=' + apiKey
// console.log(apiCall)
// $('#search-button').on("click", function () {
// fetch(apiCall)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//         console.log(data)
//     });

// });

$('#search-button').on("click", function (event) {
event.preventDefault(); 
var apiKey = '7aef1906e93e8116cc215bc5377288b3';
var getCoordinates = 'http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=' + apiKey;

fetch(getCoordinates)
.then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
var lat = data[0].lat
var lon = data[0].lon
  var getWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&appid=' + apiKey
  fetch(getWeather)
.then(function(response) {
  return response.json();
}).then(function(data) {
  console.log('weather data', data);
});
});

// prevents form from submitting
    console.log('test')
});
