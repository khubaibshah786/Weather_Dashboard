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
    var apiKey = '7aef1906e93e8116cc215bc5377288b3';
    var getCoordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchWord + '&limit=5&appid=' + apiKey + '&units=metric';

    fetch(getCoordinates)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            var cityName = data[0].name;
            var getWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';

            fetch(getWeather)
                .then(function (response) {
                    return response.json();
                }).then(function (weatherData) {
                    var locationDiv = $("<div>");
                    $('#today').empty();
                    locationDiv.css({
                        "border": "1px solid",
                        "padding": "10px"
                    });
                    var currentDate = dayjs().format('DD/MM/YYYY');
                    var tempFahrenheit = weatherData.main.temp;
                    var humidity = weatherData.main.humidity;
                    var speed = weatherData.wind.speed;
                    var iconCode = weatherData.weather[0].icon;
                    var iconUrl = 'https://openweathermap.org/img/wn/' + iconCode + '.png';
                    var htmlContent = '<h1>' + cityName + ' (' + currentDate + ') <img src="' + iconUrl + '" alt="Weather Icon"></img></h1>';
                    htmlContent += '<p>Temperature: ' + tempFahrenheit + '°C' + '</p>';
                    htmlContent += '<p>Wind Speed: ' + speed + 'KPH' + '</p>';
                    htmlContent += '<p>Humidity: ' + humidity + '%' + '</p>';
                    locationDiv.html(htmlContent);
                    $('#today').append(locationDiv);
                    fiveDayForecast(lat, lon, apiKey);
                });
        });
}

getCurrentWeather();


function fiveDayForecast(lat, lon, apiKey) {
    var forecastApiCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&cnt=5&units=metric';

    fetch(forecastApiCall)
        .then(function (response) {
            return response.json();
        }).then(function (forecastData) {
            $('#forecast').empty();
            console.log('5 day weather forecast', forecastData);
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

                var forecastCard = $('<div>').addClass('card');
                forecastCard.css('border', '1px solid');

                var forecastContent = '<h3>' + forecastDate + '</h3>';
                forecastContent += '<img src="' + forecastIconUrl + '" alt="Weather Icon">';
                forecastContent += '<p>Temperature: ' + forecastTemp + '°C' + '</p>';
                forecastContent += '<p>Wind Speed: ' + forecastSpeed + 'KPH' + '</p>';
                forecastContent += '<p>Humidity: ' + forecastHumidity + '%' + '</p>';

                forecastCard.html(forecastContent);
                forecastContainer.append(forecastCard);
            }

            $('#forecast').append(forecastContainer);
        });
}


