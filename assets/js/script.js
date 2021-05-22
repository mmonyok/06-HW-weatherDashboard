let inputValue = $('#query');
let searchBtnEl = $('#searchBtn');
let tempEl = $('#temp');
let windEl = $('#wind');
let humidityEl = $('#humidity');
let uvIndexEl = $('#uvIndex');
let apiKey = "&appid=c5c4d5e93d080070caa63a5458f238e2";
let requestURL;

function getLatLon(event) {
    event.preventDefault();
    let query = inputValue.val();
    requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + apiKey;
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
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
            genDaily(data);
            genFiveDay(data);
            return;
        })

    function genDaily(data) {
        let temp = "Temp: " + data.current.temp + " \u00B0F";
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
        return;
    }

    function genFiveDay(data) {
        console.log(data.daily[0].weather[0].icon);
        let fiveDayEl = $('.fiveDayForecast');
        fiveDayEl.empty();
        let dayEl = [
            $('#day1'),
            $('#day2'),
            $('#day3'),
            $('#day4'),
            $('#day5'),
        ]
        for (let z = 0; z < 5; z++) {
            for (let i = 0; i < 5; i++) {
                let weatherInfo = [
                    "Date",
                    "http://openweathermap.org/img/wn/" + data.daily[z].weather[0].icon + "@2x.png",
                    data.daily[z].temp.day + " \u00B0F",
                    data.daily[z].wind_speed + " MPH",
                    data.daily[z].humidity + " %",
                ];
                if (i === 1) {
                    let liEl = $('<li>');
                    let img = $('<img>');
                    img.attr("src", weatherInfo[i]);
                    img.attr("class", "icon");
                    liEl.append(img);
                    dayEl[z].append(liEl);
                } else {
                    let liEl = $('<li>');
                    liEl.text(weatherInfo[i]);
                    dayEl[z].append(liEl);
                }
            }
        }
        return;
    }
    return;
}

searchBtnEl.click(getLatLon);