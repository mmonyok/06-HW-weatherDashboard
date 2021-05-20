let inputValue = $('#query');
let searchBtnEl = $('#searchBtn');
let tempEl = $('#temp');
let windEl = $('#wind');
let humidityEl = $('#humidity');
let uvIndexEl = $('#uvIndex');
let inputQuery = "name=" + query;
let apiKey = "&appid=c5c4d5e93d080070caa63a5458f238e2";
let requestURL;


function getLatLon(event) {
    event.preventDefault();
    let query = inputValue.val();
    console.log(query);
    requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + apiKey;

    fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        let lineData = data.coord;
        console.log(lineData);
        weatherData(lineData);
    })
return;
}

function weatherData(coordinates) {
    let lon = coordinates.lon;
    let lat = coordinates.lat
    console.log(lon + " " + lat);
    requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + apiKey;
    
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
            tempEl.empty();
            windEl.empty();
            humidityEl.empty();
            uvIndexEl.empty();
            tempEl.append(temp);
            windEl.append(wind);
            humidityEl.append(humidity);
            uvIndexEl.append(uvIndex);
        })
    return;
}

searchBtnEl.click(getLatLon);