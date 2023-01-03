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



function citySearch() {}

function storeSearchHistory() {}

function forcast() {}

function getSearchHistory() {}



var apiKey = "93a9448c198f02ecbe576b63b0dc64b3";

var city;


// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={}
console.log(apiKey)
