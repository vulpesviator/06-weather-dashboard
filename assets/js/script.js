$(function () {

var searchBtn = $(".search-button");
var clearBtn = $(".clear-button")
var citySearch = $(".city-search");
var apiKey = "eac8b0ada86d323c106004da27e70b99";


function getWeather(data) {
   
  var cityName = citySearch.val().trim();;
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  
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
    .then(function(data) {
      console.log(data);
      
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

      var cityInfo = {
        city: cityName,
        lat: data.coord.lat,
        lon: data.coord.lon
      }

      savedCities.push(cityInfo);
      localStorage.setItem("cities", JSON.stringify(savedCities));

      getForecast(apiKey, cityName, cityInfo.lat, cityInfo.lon);

      return cityInfo;
    
    });
}

function getForecast(apiKey, cityName, lat, lon) {
  
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  console.log(cityName);

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