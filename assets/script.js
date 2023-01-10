
var formInput = document.querySelector(".city-name")
var searchHistory = document.querySelector(".search-history")
var searchedCityList = document.querySelector('.searched-cities');
var prevSearchArr = document.querySelectorAll(".previous-search");
var apiKey = "93a9448c198f02ecbe576b63b0dc64b3";
var cityObjArr;
var newIcon = document.querySelector('.icon');
var city = document.querySelector('.city-weather');
var currentHigh = document.querySelector('.high');
var currentLow = document.querySelector('.low');
var currentAirPressure = document.querySelector('.pressure');
var currentHumidity = document.querySelector('.humidity');
var currentWind = document.querySelector(".wind");
var todayDate = document.querySelector('.date');
var fiveDayOutlook = document.querySelector('.forecast-card');
var todayType = document.querySelector('.today-type');
var weekCity = document.querySelector('.week');
var today = dayjs();
var btn = document.querySelector('.btn');


// var coordinates;
addCityHistory()

function main() {
    checkForCoordinates(formInput.value);

}

// checks to see if a city name has already been saved to the City Object Array, if it has, it moves it to the end of the array in local storage so that it will be appended as most recent search
// then current weather and forecast are called for the user inputted city. if the city is not in the array, then it calls new search
function checkForCoordinates(searchedCity) {
    cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
    if (cityObjArr !== null) {
        for (i = 0; i < cityObjArr.length; i++) {
            if (cityObjArr[i].cityName == searchedCity) {
                cityObjArr.push(cityObjArr[i]);
                cityObjArr.splice(i, 1,);
                localStorage.clear();
                localStorage.setItem("cityObjArr", JSON.stringify(cityObjArr));
                currentWeather(searchedCity, cityObjArr[i].coordinates);
                forecast(searchedCity, cityObjArr[i].coordinates);
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
            let latitude = data[0].lat;
            let longitude = data[0].lon;
            let coordinates = [latitude, longitude];
            let geoData = {
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
            currentWeather(userCity, coordinates);
            forecast(userCity, coordinates);
        });
};
// fetches todays forcast from the selected city and sends it to add weather. Then calls reset city history.
function currentWeather(cityName, coordinates) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&appid=" + apiKey + "&units=imperial";
    fetch(requestUrl)
        .then(function (response) {
           return response.json(); 
        })
        .then(function (data) {
            console.log(data)
            addWeather(cityName, data);
            resetCityHistory();
        })
};
// fetches the five day outlook for the selected city and sends it to add forecast
function forecast(cityName, coordinates) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&appid=" + apiKey + "&units=imperial";
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            addForecast(cityName, data);
        });
};
// access local storage and add all previously searched cities to HTML storing their coordinates in a data attribute, so when they are clicked 
//  they call forcast and current weather functions. Sets a limit on the total number of searched cities that appear on the screen to 5
function addCityHistory() {
    cityObjArr = JSON.parse(localStorage.getItem("cityObjArr"));
    if (cityObjArr === null) {
        return;
    } else if (cityObjArr.length < 5) {
        for (i = cityObjArr.length - 1; i >= 0; i--) {
            let text = cityObjArr[i].cityName;
            let coordinates = cityObjArr[i].coordinates;
            let cityEl = document.createElement('li');
            cityEl.setAttribute("class", "previous-search");
            cityEl.textContent = text;
            cityEl.setAttribute('data-latitude', coordinates[0]);
            cityEl.setAttribute('data-longitude', coordinates[1]);
            searchedCityList.appendChild(cityEl);
        };
    } else if (cityObjArr.length >= 5) {
        for (i = cityObjArr.length - 1; i >= cityObjArr.length - 5; i--) {
            let text = cityObjArr[i].cityName;
            let coordinates = cityObjArr[i].coordinates;
            let cityEl = document.createElement('li');
            cityEl.setAttribute("class", "previous-search");
            cityEl.textContent = text;
            cityEl.setAttribute('data-latitude', coordinates[0]);
            cityEl.setAttribute('data-longitude', coordinates[1]);
            searchedCityList.appendChild(cityEl);
        };
    };
};
//  clears the list of previous cities and appends the new list of previous cities
function resetCityHistory() {
    searchedCityList.replaceChildren();
    addCityHistory();
};
function resetFiveDay() {
    fiveDayOutlook.replaceChildren()
}
// adds the 5 day outlook to the HTML
function addForecast(cityName, data) {
    weekCity.textContent = "Five day outlook for " + cityName
    resetFiveDay()
    let fiveDay = data.list.filter(time => time.dt_txt.includes("12:00:00"))
    for (i = 0; i < fiveDay.length; i++) {
        let day = fiveDay[i];
        console.log(day)
        let tempMax = day.main.temp_max;
        let icon = day.weather.icon
        let humidity = day.main.humidity;
        let windSpeed = day.wind.speed
        let date = dayjs(day.dt_txt)
        let dayEl = document.createElement('div');
        dayEl.setAttribute('class', 'day-card');
        dayEl.textContent = date.format('ddd MMM DD');
        fiveDayOutlook.appendChild(dayEl);
        let dayTempMax = document.createElement('p')
        let dayIcon = document.createElement('p')
        let dayHumidity = document.createElement('p')
        let dayWind = document.createElement('p')
        dayTempMax.textContent = tempMax+ "\u00B0F";
        dayHumidity.textContent = humidity + "% Humidity";
        dayWind.textContent = windSpeed + "MPH winds";
        dayEl.appendChild(dayTempMax)
        dayEl.appendChild(dayHumidity)
        dayEl.appendChild(dayWind);


    }

};

// adds todays weather to the HTML 
function addWeather(cityName, data) {
    let weather = data.main;
    let humidity = weather.humidity;
    let pressure = weather.pressure + " kilopascals";
    let temp = weather.temp + "\u00B0F";
    let hi = weather.temp_max + "\u00B0F";
    let low = weather.temp_min + "\u00B0F";
    let type = data.weather[0].main;
    let windSpeed = data.wind.speed;
    let windGust = data.wind.gust;
    let icon = data.weather[0].icon;
    newIcon.src = "http://openweathermap.org/img/wn/" + icon + ".png";
    city.textContent = cityName;
    currentHigh.textContent = "Today's high: " + hi;
    currentLow.textContent = "Today's low: " + low;
    currentAirPressure.textContent = "Pressure: " + pressure;
    currentHumidity.textContent = humidity + "% Humidity";
    if (windGust == undefined) {
        currentWind.textContent = "Wind: " + windSpeed + "MPH"
    } else {
        currentWind.textContent = "Wind: " + windSpeed + "MPH" + " with gusts up to " + windGust + "MPH"
    }
    todayDate.textContent = today.format('ddd MMM DD, YYYY');
    todayType.textContent = type;
};

// Grab the coordinates from the data attribute in a previous city and call the two forecasting functions
function callPreviousCity(event) {
    let clickedCity = event.target
    let cityName = clickedCity.innerHTML
    let latitude = clickedCity.getAttribute('data-latitude')
    let longitude = clickedCity.getAttribute('data-longitude')
    forecast(cityName, [latitude, longitude])
    currentWeather(cityName, [latitude, longitude])
}

searchedCityList.addEventListener('click', callPreviousCity)
btn.addEventListener('click',main)
formInput.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        main();
    };
});