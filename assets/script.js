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
var searchedCityList = document.querySelector('.searched-cities');
var prevSearchArr = document.querySelectorAll(".previous-search");
var apiKey = "93a9448c198f02ecbe576b63b0dc64b3";
var cityObjArr;
// var coordinates;
console.log(searchedCityList)
addCityHistory()

function main() {
    checkForCoordinates(formInput.value);
    resetCityHistory();

}

function checkForCoordinates(searchedCity) {
    cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
    // is this just a while loop???? gunna be so mad
    if (cityObjArr !== null) {
        for (i = 0; i < cityObjArr.length; i++) {
            if (cityObjArr[i].cityName == searchedCity) {
                currentWeather(cityObjArr[i].coordinates);
                forecast(cityObjArr[i].coordinates);
                // the return false below is the most precious line of code ever written, it goes back up to the first if statement and says PSCYHE! 
                // WE ARE FALSE NOW and thefore stops the forloop. DO NOT REMOVE 
                return false
            }
        } newSearch(searchedCity);
    } else if (cityObjArr === null) {
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
            cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
            // if this is the first search, cityObjArr will point at nothing and needs to be set to an empty array.
            if (cityObjArr == null) {
                cityObjArr = [];
            };
            cityObjArr.push(geoData);
            localStorage.setItem("cityObjArr", JSON.stringify(cityObjArr));
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
            // console.log(data)
            addWeather(data)
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
            // console.log(data)
        });
}
// access local storage and add all previously searched cities to HTML storing their coordinates in a data attribute, so when they are clicked  the call forcast and current weather functions.
function addCityHistory() {
    cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
    // console.log(cityObjArr);
    
    if (cityObjArr === null){
        return;
    } else if (cityObjArr.length < 5) {
        for (i = 0; i < cityObjArr.length; i++) {
            var text = cityObjArr[i].cityName;
            var coordinates = cityObjArr[i].coordinates;
            var cityEl = document.createElement('li');
            cityEl.setAttribute("class", "previous-search");
            cityEl.textContent = text;
            cityEl.setAttribute('data-latitude', coordinates[0]);
            cityEl.setAttribute('data-longitude', coordinates[1]); 
            searchedCityList.appendChild(cityEl);
        };
    } else if (cityObjArr.length >= 5){
        for (i = cityObjArr.length - 5; i < cityObjArr.length; i++) {
            var text = cityObjArr[i].cityName;
            var coordinates = cityObjArr[i].coordinates;
            var cityEl = document.createElement('li');
            cityEl.setAttribute("class", "previous-search");
            cityEl.textContent = text;
            cityEl.setAttribute('data-latitude', coordinates[0]);
            cityEl.setAttribute('data-longitude', coordinates[1]);
            searchedCityList.appendChild(cityEl);
        };
    } ;
};
// needs to load one previous city at a time  for up to 5 total cities and always displays the five most recent
function resetCityHistory(){
// find the five most recent city names and append them to the screen, DISCLUDE the current city. 
    searchedCityList.replaceChildren()
    addCityHistory()
}
// Displays the five day outlook 
function addForecast() { };

// adds todayus weather 
function addWeather(data) { 
    console.log('we have arrived')
};

// defines what happens when the click event is called
function callPreviousCity(event){
    var clickedCity =event.target
    var cityName =clickedCity.innerHTML
    var latitude =clickedCity.getAttribute('data-latitude')
    var longitude= clickedCity.getAttribute('data-longitude')
    forecast([latitude, longitude])
    currentWeather([latitude,longitude])

    
 }
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={}
// console.log(apiKey)
searchedCityList.addEventListener('click',callPreviousCity)
formInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        main();
    };
});