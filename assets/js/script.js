let query = $('#query');
let searchBtn = $('#searchbtn');
let tempEl = $('#temp');
let windEl = $('#wind');
let humidityEl = $('#humidity');
let uvIndexEl = $('#uvIndex');

function weatherData(event) {
    // event.preventDefault();
    let apiKey = "&appid=c5c4d5e93d080070caa63a5458f238e2";
    let requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=44.9537&lon=93.0900&units=imperial" + apiKey;

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let temp = "Temp: " + data.current.temp;
            let wind = "Wind: " + data.current.wind_speed + " MPH";
            let humidity = "Humidity: " + data.current.humidity + " %";
            let uvIndex = "UV Index: " + data.current.uvi;
            tempEl.append(temp);
            windEl.append(wind);
            humidityEl.append(humidity);
            uvIndexEl.append(uvIndex);
        })
}
weatherData();

// searchBtn.addEventListener("click", weatherData);