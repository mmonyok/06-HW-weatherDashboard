// add something for if they hit search with nothing in it.
// make buttons stay on page after refresh
// make buttons append to beginning instead of end.

let inputValue = $('#query');
let searchBtnEl = $('#searchBtn');
let tempEl = $('#temp');
let windEl = $('#wind');
let humidityEl = $('#humidity');
let uvIndexEl = $('#uvIndex');
let apiKey = "&appid=c5c4d5e93d080070caa63a5458f238e2";
let requestURL;
let historyBtn = $('button');

// This function will use a city query with the weather API to get the data.
function getLatLon(event) {
    event.preventDefault();
    let query = inputValue.val();
    requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + apiKey;
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // This variable holds the latitude and longitude data, so it can be passed onto the additional weather search functions.
            weatherData(data);
        })
    createStorageBtn(query);
    return;
}

// This is similar to the one above except that it is taking in the query from specific buttons that are selected, and it isn't running the create button function.
function savedCity(buttonHistory) {
    requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + buttonHistory + "&units=imperial" + apiKey;
    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            weatherData(data);
        })
    return;
}

// This function will dynamically create buttons in the search history section that when clicked will search the indicated city again.
function createStorageBtn(query) {
    let searchHistoryEl = $('#searchHistory');
    let historyLiEl = $('<li>');
    // This will create a new button with the search query value as its name.
    savedSearchBtn = $('<button>');
    savedSearchBtn.addClass("historyBtn");
    savedSearchBtn.text(query);
    savedSearchBtn.attr('id', query);
    historyLiEl.append(savedSearchBtn);
    searchHistoryEl.append(historyLiEl);
    // Saves the query to local storage
    let savedQuery = {
        queryData: query,
    };
    localStorage.setItem(query, JSON.stringify(savedQuery));
}

// This will make each newly created button clickable and send the city name to the function that will pull the latitude and longitude data from it.
$("#searchHistory").on("click", ".historyBtn", function (event) {
    event.preventDefault();
    let buttonData = JSON.parse(localStorage.getItem($(this).attr('id')));
    let buttonHistory = buttonData.queryData;
    console.log(buttonHistory);
    savedCity(buttonHistory);
});

// This function pulls
function weatherData(data) {
    console.log("weatherData");
    console.log(data);
    let lineData = data.coord;
    let cityName = data.name;
    // Gets us the longitute and latitude data.
    let lon = lineData.lon;
    let lat = lineData.lat
    // Our API call.
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
        console.log("genDaily Data");
        console.log(data);
        // Converts the date time stamp to a readable output.
        let unixTime = data.current.dt;
        let dateConversion = new Date(unixTime * 1000);
        let date = dateConversion.toLocaleDateString("en-Us");
        let weatherHeadEl = $('#weatherHead')
        let dailyEl = $('#dailyWeather');
        weatherHeadEl.empty();
        dailyEl.empty();
        let dailyHeading = [
            cityName,
            " (" + date + ")",
            "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png",
        ]
        let dailyWeather = [
            "Temp: " + data.current.temp + " \u00B0F",
            "Wind: " + data.current.wind_speed + " MPH",
            "Humidity: " + data.current.humidity + " %",
            data.current.uvi,
        ]
        console.log("UV Index");
        console.log(data.current.uvi);
        for (let q = 0; q < dailyHeading.length; q++) {
            if (q === 2) {
                let img = $('<img>');
                img.attr("src", dailyHeading[q]);
                img.attr("class", "icon");
                weatherHeadEl.append(img);
            } else {
                weatherHeadEl.append(dailyHeading[q]);
            }
        }

        for (let y = 0; y < dailyWeather.length; y++) {
            if (y === 3) {
                console.log(dailyWeather[y]);
                let spanEl = $('<span>');
                spanEl.attr("id", "uvIndex");
                if (dailyWeather[y] < 3) {
                    spanEl.css({"background-color": "green", "color": "white"});
                } else if (dailyWeather[y] >= 3 && dailyWeather[y] < 8) {
                    spanEl.css({"background-color": "yellow", "color": "black"});
                } else {
                    spanEl.css({"background-color": "orangered", "color": "black"});
                }
                spanEl.text(dailyWeather[y]);
                let liEl = $('<li>');
                liEl.text("UV Index: ");
                liEl.append(spanEl);
                dailyEl.append(liEl);
            } else {
                let liEl = $('<li>');
                liEl.text(dailyWeather[y])
                dailyEl.append(liEl);
            }
        }
        return;
    }

    function genFiveDay(data) {
        let fiveDayEl = $('.fiveDayForecast');
        fiveDayEl.empty();
        let dayEl = [
            $('#day1'),
            $('#day2'),
            $('#day3'),
            $('#day4'),
            $('#day5'),
        ]
        // The inner loop appends the current weather data point to the div and then the outer loop changes which day is being added.
        for (let z = 0; z < 5; z++) {
            for (let i = 0; i < 5; i++) {
                // Converts the date time stamp to a readable output for each day of the forecast.
                unixTime = data.daily[z].dt;
                dateConversion = new Date(unixTime * 1000);
                date = dateConversion.toLocaleDateString("en-Us");
                let weatherInfo = [
                    date,
                    "http://openweathermap.org/img/wn/" + data.daily[z].weather[0].icon + "@2x.png",
                    "Temp: " + data.daily[z].temp.day + " \u00B0F",
                    "Wind: " + data.daily[z].wind_speed + " MPH",
                    "Humidity: " + data.daily[z].humidity + " %",
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