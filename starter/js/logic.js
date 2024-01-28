$('#search-button').on("click", function (event) {
    var searchWord = $('#search-input').val().trim();
    localStorage.setItem('searchWord', searchWord);
    event.preventDefault();
    var apiKey = '7aef1906e93e8116cc215bc5377288b3';
    var getCoordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchWord + '&limit=5&appid=' + apiKey;

    fetch(getCoordinates)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            var cityName = data[0].name;
            var getWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

            fetch(getWeather)
                .then(function (response) {
                    return response.json();
                }).then(function (weatherData) {
                    console.log('weather data', weatherData);

                    var locationDiv = $("<div>");
                    // Clear locationDiv before appending new content
                    $('#today').empty();

                    // Adding CSS border and padding to the locationDiv
                    locationDiv.css({
                        "border": "1px solid",
                        "padding": "10px"
                    });

                    var currentDate = dayjs().format('DD/MM/YYYY');
                    var tempFahrenheit = weatherData.main.temp;
                    var tempCelsius = (tempFahrenheit - 273.15).toFixed(2);
                    var humidity = weatherData.main.humidity;
                    var speed = weatherData.wind.speed;
                    var iconCode = weatherData.weather[0].icon;
                    var iconUrl = 'https://openweathermap.org/img/wn/' + iconCode + '.png';

                    var htmlContent = '<h1>' + cityName + ' (' + currentDate + ') <img src="' + iconUrl + '" alt="Weather Icon"></img></h1>';
                    htmlContent += '<p>Temperature: ' + tempCelsius +'°C'+ '</p>';
                    htmlContent += '<p>Wind Speed: ' + speed +'KPH'+ '</p>';
                    htmlContent += '<p>Humidity: ' + humidity +'%'+ '</p>';

                    // Setting HTML content of locationDiv
                    locationDiv.html(htmlContent);

                    // Append locationDiv to the today section
                    $('#today').append(locationDiv);
                });
        });
});
