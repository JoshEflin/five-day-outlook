// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// BUGS- form input does not allow for state code or country code

var formInput = document.querySelector(".city-name")
var searchHistory = document.querySelector(".search-history")
var prevSearchArr = document.querySelectorAll(".previous-search")
var apiKey = "93a9448c198f02ecbe576b63b0dc64b3";
var cityObj;
// var coordinates;

addCityHistory()

function main() {
    checkForCoordinates(formInput.value)
    addCityHistory()
}

function checkForCoordinates(searchedCity) {
    cityObj = JSON.parse(localStorage.getItem("cityObj"));
    if (cityObj !== null) {
        for (i = 0; i < cityObj.length; i++) {
            if (cityObj[i].cityName === searchedCity) {
                currentWeather(cityObj[i].coordinates);
                forecast(cityObj[i].coordinates);
                // the return false below is the most precious line of code ever written, it goes back up to the first if statement and says PSCYHE! 
                // WE ARE FALSE NOW and thefore stops the forloop. DO NOT REMOVE 
                return false
            }
        } newSearch(searchedCity);
    } else if (cityObj === null) {
        newSearch(searchedCity);
    };
};


// newSearch gets geocoding Data from the API and puts it in local storage
function newSearch(userCity) {


    var geoRequestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=&appid=" + apiKey;
    fetch(geoRequestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            var coordinates = [latitude, longitude];
            var geoData = {
                cityName: userCity,
                coordinates: coordinates
            };
            cityObj = JSON.parse(localStorage.getItem("cityObj"));
            // if this is the first search, cityObj will point at nothing and needs to be set to an empty array.
            if (cityObj == null) {
                cityObj = [];
            };
            cityObj.push(geoData);
            localStorage.setItem("cityObj", JSON.stringify(cityObj));
            currentWeather(coordinates);
            forecast(coordinates);
        });
}
// use local storage to store the search city name only, then grab the city name and perform a new fetch with current data
function currentWeather(coordinates) {
    console.log("current weather called")

    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&appid=" + apiKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            //  data needs to be passed to addWeather
        })
}
function forecast(coordinates) {
    console.log("5 day forecast called")

    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&appid=" + apiKey;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        });
}
// access local storage and add all previously searched cities to HTML storing their coordinates in a data attribute, so when they are clicked  the call forcast and current weather functions.
function addCityHistory() {
    cityObj = JSON.parse(localStorage.getItem("cityObj"));
    console.log(cityObj);
    if (cityObj !== null) {
        for (i = 0; i < cityObj.length; i++) {
            var text = cityObj[i].cityName;
            var coordinates = cityObj[i].coordinates;
            var cityEl = document.createElement('div')
            cityEl.setAttribute("class", "previous-search")
            cityEl.textContent = text;
            cityEl.setAttribute('data-latitude', coordinates[0]);
            cityEl.setAttribute('data-longitude', coordinates[1]);
            searchHistory.appendChild(cityEl);
        }
    }
}
function addForecast() { }
function addWeather() { }

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={}
// console.log(apiKey)

formInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        main();
    };
});