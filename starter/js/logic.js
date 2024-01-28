$('#search-button').on("click", function (event) {
    var searchWord = $('#search-input').val().trim();
    localStorage.setItem('searchWord', searchWord)
    event.preventDefault();
    var apiKey = '7aef1906e93e8116cc215bc5377288b3';
    var getCoordinates = 'http://api.openweathermap.org/geo/1.0/direct?q='+searchWord+'&limit=5&appid=' + apiKey;

    fetch(getCoordinates)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var lat = data[0].lat
            var lon = data[0].lon
            var getWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey
            fetch(getWeather)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    console.log('weather data', data);
                    $('#today').text(JSON.stringify(data))
                });
        });

    console.log('test')
});
