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
            // This variable holds the latitude and longitude data, so it can be passed onto the additional weather search functions.
            let lineData = data.coord;
            console.log(lineData);
            weatherData(lineData);
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
            let lineData = data.coord;
            console.log(lineData);
            weatherData(lineData);
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
$("#searchHistory").on("click", ".historyBtn", function(event) {
    event.preventDefault();
    let buttonData = JSON.parse(localStorage.getItem($(this).attr('id')));
    let buttonHistory = buttonData.queryData;
    console.log(buttonHistory);
    savedCity(buttonHistory);
});

// This function pulls
function weatherData(coordinates) {
    let lon = coordinates.lon;
    let lat = coordinates.lat
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