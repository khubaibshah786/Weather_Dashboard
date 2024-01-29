$(document).ready(function () {
    // Load search history buttons from localStorage when the page loads
    var searchWords = JSON.parse(localStorage.getItem('searchWords')) || [];
    searchWords.forEach(function (searchWord) {
        var historyEntry = $('<div>').addClass('input-group mb-2');

        var searchHistoryButton = $("<button>").addClass("btn btn-primary form-control").text(searchWord);
        searchHistoryButton.on('click', function () {
            // event.preventDefault();
            getWeatherData(searchWord);
        });

        var deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
        deleteButton.on('click', function () {
            // Remove the searchWord from localStorage
            searchWords = searchWords.filter(function (word) {
                return word !== searchWord;
            });
            localStorage.setItem('searchWords', JSON.stringify(searchWords));

            // Remove the history entry from the DOM
            historyEntry.remove();
        });

        historyEntry.append(searchHistoryButton, deleteButton);
        $('#history').append(historyEntry);
    });

    getCurrentWeather();
});

function getCurrentWeather() {
    $('#search-button').on("click", function (event) {
        event.preventDefault();
        var searchWord = $('#search-input').val().trim();

        // Retrieve existing search words from localStorage
        var searchWords = JSON.parse(localStorage.getItem('searchWords')) || [];

        // Check if the search word already exists in history
        if (!searchWords.includes(searchWord)) {
            // Add the new search word to the array
            searchWords.push(searchWord);

            // Store the updated array back to localStorage
            localStorage.setItem('searchWords', JSON.stringify(searchWords));

            // Create and append the button for the new search word
            var historyEntry = $('<div>').addClass('input-group mb-2');

            var searchHistoryButton = $("<button>").addClass("btn btn-primary form-control").text(searchWord);
            searchHistoryButton.on('click', function () {
                getWeatherData(searchWord);
            });

            var deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
            deleteButton.on('click', function () {
                // Remove the searchWord from localStorage
                searchWords = searchWords.filter(function (word) {
                    return word !== searchWord;
                });
                localStorage.setItem('searchWords', JSON.stringify(searchWords));

                // Remove the history entry from the DOM
                historyEntry.remove();
            });

            historyEntry.append(searchHistoryButton, deleteButton);
            $('#history').append(historyEntry);
        }

        // Call the weather APIs with the searchWord
        getWeatherData(searchWord);
    });
}


function getWeatherData(searchWord) {
    // API key for OpenWeatherMap
    var apiKey = '7aef1906e93e8116cc215bc5377288b3';
    
    // API endpoint to get coordinates based on the search word
    var getCoordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchWord + '&limit=5&appid=' + apiKey + '&units=metric';

    // Fetch coordinates based on the search word
    fetch(getCoordinates)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            // Extract latitude, longitude, and city name from the response data
            var lat = data[0].lat;
            var lon = data[0].lon;
            var cityName = data[0].name;
            
            // API endpoint to get current weather data based on latitude and longitude
            var getWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';

            // Fetch current weather data based on latitude and longitude
            fetch(getWeather)
                .then(function (response) {
                    return response.json();
                }).then(function (weatherData) {
                    // Create a div element to display weather information
                    var locationDiv = $("<div>");
                    $('#today').empty();
                    locationDiv.css({
                        "border": "1px solid",
                        "padding": "10px"
                    });
                    
                    // Get the current date
                    var currentDate = dayjs().format('DD/MM/YYYY');
                    
                    // Extract temperature, humidity, wind speed, and weather icon code from the weather data
                    var tempCelsius = weatherData.main.temp;
                    var humidity = weatherData.main.humidity;
                    var speed = weatherData.wind.speed;
                    var iconCode = weatherData.weather[0].icon;
                    
                    // Construct the URL for the weather icon
                    var iconUrl = 'https://openweathermap.org/img/wn/' + iconCode + '.png';
                    
                    // Construct HTML content to display weather information
                    var htmlContent = '<h1>' + cityName + ' (' + currentDate + ') <img src="' + iconUrl + '" alt="Weather Icon"></img></h1>';
                    htmlContent += '<p>Temperature: ' + tempCelsius + '°C' + '</p>';
                    htmlContent += '<p>Wind Speed: ' + speed + 'KPH' + '</p>';
                    htmlContent += '<p>Humidity: ' + humidity + '%' + '</p>';
                    
                    // Set the HTML content of the locationDiv and append it to the '#today' element
                    locationDiv.html(htmlContent);
                    $('#today').append(locationDiv);
                    
                    // Call the function to display the five-day forecast
                    fiveDayForecast(lat, lon, apiKey);
                });
        });
}

getCurrentWeather();


function fiveDayForecast(lat, lon, apiKey) {
    // Construct the API call URL for fetching 5-day forecast data
    var forecastApiCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&cnt=5&units=metric';

    // Fetch the forecast data
    fetch(forecastApiCall)
        .then(function (response) {
            return response.json();
        }).then(function (forecastData) {
            // Clear the existing forecast content
            $('#forecast').empty();

            // Log the fetched forecast data to the console
            console.log('5 day weather forecast', forecastData);

            // Create a container div for the forecast cards
            var forecastContainer = $('<div>').addClass('forecast-container');

            // Add the "5-day forecast" heading
            var forecastHeading = $('<h2>').text('5-day forecast');
            $('#forecast').append(forecastHeading);

            // Loop through the forecast data to display weather for each day
            for (var i = 0; i < forecastData.list.length; i++) {
                var forecast = forecastData.list[i];
                var forecastDate = dayjs(forecast.dt_txt).format('DD/MM/YYYY');
                var forecastTemp = forecast.main.temp;
                var forecastHumidity = forecast.main.humidity;
                var forecastSpeed = forecast.wind.speed;
                var forecastIconCode = forecast.weather[0].icon;
                var forecastIconUrl = 'https://openweathermap.org/img/wn/' + forecastIconCode + '.png';

                // Create a card div for each forecast entry
                var forecastCard = $('<div>').addClass('card');
                forecastCard.css('border', '1px solid');

                // Construct the HTML content for the forecast entry
                var forecastContent = '<h3>' + forecastDate + '</h3>';
                forecastContent += '<img src="' + forecastIconUrl + '" alt="Weather Icon">';
                forecastContent += '<p>Temperature: ' + forecastTemp + '°C' + '</p>';
                forecastContent += '<p>Wind Speed: ' + forecastSpeed + 'KPH' + '</p>';
                forecastContent += '<p>Humidity: ' + forecastHumidity + '%' + '</p>';

                // Set the HTML content of the forecast card
                forecastCard.html(forecastContent);

                // Append the forecast card to the forecast container
                forecastContainer.append(forecastCard);
            }

            // Append the forecast container to the forecast section
            $('#forecast').append(forecastContainer);
        });
}


