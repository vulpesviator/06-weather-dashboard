$(function () {

var searchBtn = $(".search-button");
var clearBtn = $(".clear-button")
var citySearch = $(".city-search");
var apiKey = "eac8b0ada86d323c106004da27e70b99";



function getWeather(data) {
  
  emptyCurrentWeather();
  
  var cityName = citySearch.val().trim();;
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  
  var currentForecastIcon = document.querySelector("#current-forecast-icon")
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

      currentForecastIcon.innerHTML = `<img src= "http://openweathermap.org/img/wn/${data.weather[0].icon}.png">`

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
      
      displayHistory();

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
      console.log(data.list[0].main.temp);
      console.log(dayjs.unix(data.list[0].dt).format("ddd"));

      var array = [5, 13, 21, 29, 37]

      var selectedItems = data.list.filter(function(item, index) {
        return array.includes(index);
      });

      selectedItems.forEach(function(item) {
        var day = dayjs.unix(item.dt).format("ddd");
        var icon = item.weather[0].icon;
        var forecast = item.weather[0].description;
        var temp = Math.round(item.main.temp);
        var maxTemp = Math.round(item.main.temp_max);
        var minTemp = Math.round(item.main.temp_min);
        var windSpeed = Math.round(item.wind.speed);
        var forecastHumidity = item.main.humidity;
    
        var forecastList = document.querySelector("#forecast-list");
    
        var cardContainer = document.createElement("div");
        cardContainer.classList.add('card', 'col-lg-2','col-md-12');
    
        var cardBody = document.createElement("div");
        cardBody.classList.add('card-body');
    
        var card = document.createElement("div");
        card.classList.add('col-12');
        card.innerHTML = `<div>
                            <h5 id="forecast-day" class="card-title">${day}</h5>
                          </div>
                          <div>
                          <img src= "http://openweathermap.org/img/wn/${icon}.png">
                          </div>
                          <div>
                              <p id="forecast-1">${forecast}</p>
                          </div>
                          <div id="forecast-temp">
                              <h4>${temp}\&deg;</h4>
                              <p class="card-text">${maxTemp}\&deg; H/${minTemp}\&deg; L</p>
                          </div>
                          <div>
                            <p class="f-wind-speed">Wind: ${windSpeed} MPH</p>
                          </div>
                          <div>
                            <p class="f-humidity">Hum: ${forecastHumidity}%</p>
                          </div>`
    
        cardBody.appendChild(card);
        cardContainer.appendChild(cardBody);
        forecastList.appendChild(cardContainer);
      })
    })
}

function displayHistory() {
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  var cityHistory = document.getElementById("history");

  cityHistory.innerHTML = "";

  for (i = 0; i < savedCities.length; i++) {
    var historyBtn = document.createElement("button");
    historyBtn.classList.add("btn", "btn-primary", "my-2", "history-city");
    historyBtn.innerHTML = `${savedCities[i].city}`;
    cityHistory.appendChild(historyBtn);
  }
  return;
};

function emptyCurrentWeather () {
  var currentForecastIcon = document.querySelector("#current-forecast-icon")
  var currentTemp = document.querySelector("#current-temp");
  var currentCity = document.querySelector("#current-city");
  var currentWeatherState = document.querySelector("#weather-state");
  var currentHighTemp = document.querySelector("#current-high");
  var currentLowTemp = document.querySelector("#current-low");
  var currentWindSpeed = document.querySelector("#current-wind-speed");
  var currentHumidity = document.querySelector("#current-humidity");
  var currentDate = document.querySelector("#date");

  currentCity.innerHTML = "";

  currentForecastIcon.innerHTML = "";

  currentTemp.innerHTML = "";

  currentWeatherState.innerHTML = "";

  currentHighTemp.innerHTML = "";

  currentLowTemp.innerHTML = "";

  currentWindSpeed.innerHTML = "";

  currentHumidity.innerHTML = "";

  currentDate.innerHTML = dayjs().format("dddd, MMMM D, YYYY");
  
  var forecastList = document.querySelector("#forecast-list");
  forecastList.innerHTML = "";

  return;
}

searchBtn.on("click", getWeather);

});