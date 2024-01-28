
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
var queryURL = 'http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=' + apiKey;

fetch(queryURL)
.then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
});

// prevents form from submitting
    console.log('test')
});
