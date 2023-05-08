$(function () {

var search = "";
var searchBtn = $(".search-button");
var clearBtn = $(".clear-button")
var citySearch = $(".city-search");

function getWeather(data) {
  var apiKey = "eac8b0ada86d323c106004da27e70b99";
  
  var cityName = citySearch.val().trim();;
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  var currentTemp = document.querySelector("#current-temp");
  var currentCity = document.querySelector("#current-city");
  var currentWeatherState = document.querySelector("#weather-state");
  var currentHighTemp = document.querySelector("#current-high");
  var currentLowTemp = document.querySelector("#current-low");
  var currentWindSpeed = document.querySelector("#current-wind-speed");
  var currentHumidity = document.querySelector("#current-humidity");
  var currentDate = document.querySelector("#date");

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      console.log(lat);
      console.log(lon);

      currentCity.innerHTML = data.name;

      var selectedCityTemp = Math.round(data.main.temp);
      currentTemp.innerHTML = `${selectedCityTemp}\&deg;`;

      currentWeatherState.innerHTML = data.weather[0].main;

      var selectedCityHighTemp = Math.round(data.main.temp_max);
      currentHighTemp.innerHTML = `${selectedCityHighTemp}\&deg;`;

      var selectedCityLowTemp = Math.round(data.main.temp_min);
      currentLowTemp.innerHTML = `${selectedCityLowTemp}\&deg;`;

      var selectedCityWindSpeed = Math.round(data.wind.speed);
      currentWindSpeed.innerHTML = `${selectedCityWindSpeed} MPH`;

      currentHumidity.innerHTML = `${data.main.humidity}%`;

      currentDate.innerHTML = dayjs().format("dddd, MMMM D, YYYY");

      getForecast();
    });
}

function getForecast() {
  var apiKey = "eac8b0ada86d323c106004da27e70b99";
  var lat = "42.3314";
  var lon = "-83.0458";
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(forecastUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
    })
}

searchBtn.on("click", getWeather);

});