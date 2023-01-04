// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// function that gets user input and uses it to make an api call

// function that gets response from the api call and converts it  into JSON ( see fetch stuff)

// extract current weather conditions from JSON and add to page

// extract forecast from JSON and add to page
//  add the data from the API call to local storage and store that in a variable  that is also added to page 

//  treat clickin on an item in the search history as a NEW API CALL and  update local storage with new information accordingly

// use an event listener, prevent default form submission for clicks and pressing enter


// PSUEDO CODE

// user types input into HTML form
// input submission is sent a as fetch request to weatherAPI
// receive JSON
// extract, City name, Date, current weather and store to object
// extract weather for next 5 days and store to new objects
// add relevant weather Icons to all objects
// append all to HTML

// store user input to local storage
// append user input and current weather for that city to HTML aside
// event listener for each appended aside to run the main fetch request function above


// BUGS- form input does not allow for state code or country code

var formInput = document.querySelector(".city-name")
var searchHistory = document.querySelector(".search-history")
var apiKey = "93a9448c198f02ecbe576b63b0dc64b3";
getSearchHistory()

function main() {
    newSearch(formInput.value)
    forecast()
}
function newSearch(userCity) {
    
    var geoRequestUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+userCity+"&limit=&appid="+apiKey;
    fetch(geoRequestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) { 
        console.log(data)  
        var latitude = data[0].lat;
        var longitude = data[0].lon
    // create a local storage object with the latitude and longitude inside
        localStorage.setItem(userCity, JSON.stringify({
            latitude: latitude,
            longitude: longitude,
        }))
    })
    
    var coordinates =JSON.parse(localStorage.getItem(formInput.value))
    return coordinates;

}
// use local storage to store the search city name only, then grab the city name and perform a new fetch with current data

function forecast() {
    // getWeathers current value is a placeholder for now
    var getWeather = newSearch(formInput.value)
    console.log(getWeather)
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+getWeather.latitude+"&lon="+getWeather.longitude+"&appid="+apiKey;
    fetch(requestUrl)
    .then(function (response){
        return response.json()
    })
    .then(function(data){
         console.log(data)
    })
}
// parse json data  and append to screen  the current weather as well as 5 day outlook
// (consider storing a prototype of JSON info in storage to use a template for faster reloading of old searches???)
function getSearchHistory() {
    console.log(localStorage)
    var cityEl = document.createElement('div')
    console.log(localStorage.boston)
    cityEl.innerText=localStorage.boston
    searchHistory.appendChild(cityEl)
    
}
// get local storage items and append them to the aside HTML element
// clicking on them performs a NEW GET request (fetch from server)




var city;


// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={}
// console.log(apiKey)

formInput.addEventListener('keydown', function(event){
    if (event.key === "Enter"){
        main();
    }
    
})