$(function () {
  /* Displays any cities already in local storage */
  displayHistory();
  
  var searchBtn = $(".search-button");
  var clearBtn = $(".clear-button");
  var citySearch = $(".city-search");
  var historyBtn = $(".history-city");
  var apiKey = "eac8b0ada86d323c106004da27e70b99";
  


  function getWeather(cityName) {
    emptyCurrentWeather();

    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    var savedCities = JSON.parse(localStorage.getItem("cities")) || [];

    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        var currentCity = data.name;
        var currentDate = dayjs().format("dddd, MMMM D, YYYY");
        var cardHeader = document.querySelector(".card-header");

        var cityContainer = document.createElement("div");
        cityContainer.classList.add("current-city");
        cityContainer.innerHTML = `${currentCity}`;

        var dateContainer = document.createElement("div");
        dateContainer.classList.add("current-date");
        dateContainer.innerHTML = `${currentDate}`;

        cardHeader.appendChild(cityContainer);
        cardHeader.appendChild(dateContainer);

        var currentTemp = Math.round(data.main.temp);
        var currentForecastIcon = data.weather[0].icon;
        var currentWeatherState = data.weather[0].main;
        var currentHighTemp = Math.round(data.main.temp_max);
        var currentLowTemp = Math.round(data.main.temp_min);
        var currentWindSpeed = Math.round(data.wind.speed);
        var currentHumidity = data.main.humidity;
        var currentWeatherContainer =
          document.querySelector("#current-weather");

        var tempInfo = document.createElement("div");
        tempInfo.classList.add("col-12", "col-md-6");
        tempInfo.innerHTML = `<div class="row align-items-center justify-content-center">
                        <div id="current-forecast-icon" class="col-md-6">
                        <img src="http://openweathermap.org/img/wn/${currentForecastIcon}.png">
                        </div>
                        <div class="col-md-6">
                            <h3 id="current-temp">${currentTemp}\&deg; <span class="temp-system">F</span></h3>
                            <p id="weather-state">${currentWeatherState}</p>
                        </div>
                        </div>`;

        var forecastInfo = document.createElement("div");
        forecastInfo.classList.add("col-12", "col-md-6", "text-start");
        forecastInfo.innerHTML = `<div class="col-12">
                            <div class="row">
                                <div class="col-md-6" id="current-high"><span class="sub-heading">High </span>${currentHighTemp}\&deg;<span class="sub-heading">F</span></div>
                                <div class="col-md-6" id="current-low"><span class="sub-heading">Low </span>${currentLowTemp}\&deg;<span class="sub-heading">F</span></div>
                            </div>
                            </div>
                            <div class="row">
                            <div class="col-md-6">
                            <p id="current-wind-speed"><span class="sub-heading">Wind:</span> ${currentWindSpeed} <span class="sub-heading">MPH</span></p>
                            </div>
                            <div class="col-md-6">
                            <p id="current-humidity"><span class="sub-heading">Humidity:</span> ${currentHumidity}<span class="sub-heading">%</span></p>
                            </div>
                            </div>`;

        currentWeatherContainer.appendChild(tempInfo);
        currentWeatherContainer.appendChild(forecastInfo);

        

        var cityInfo = {
          city: cityName,
          lat: data.coord.lat,
          lon: data.coord.lon,
        };

        var existingCityInfo = savedCities.find(function(savedCityInfo) {
          return savedCityInfo.city === cityName;
        });

        if (!existingCityInfo) {
          savedCities.push(cityInfo);
        localStorage.setItem("cities", JSON.stringify(savedCities));
        }

        getForecast(apiKey, cityName, cityInfo.lat, cityInfo.lon);

        displayHistory();

        return cityInfo;
      });
  }

  function getForecast(apiKey, cityName, lat, lon) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    console.log(cityName);

    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        console.log(data.list[0].main.temp);
        console.log(dayjs.unix(data.list[0].dt).format("ddd"));

        var array = [5, 13, 21, 29, 37];

        var selectedItems = data.list.filter(function (item, index) {
          return array.includes(index);
        });

        selectedItems.forEach(function (item) {
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
          cardContainer.classList.add("card", "col-lg-2", "col-md-12", "m-3");

          var cardBody = document.createElement("div");
          cardBody.classList.add("card-body");

          var card = document.createElement("div");
          card.classList.add("col-12");
          card.innerHTML = `<div>
                            <h5 id="forecast-day" class="card-title">${day}</h5>
                          </div>
                          <div id="forecast-img">
                          <img src= "http://openweathermap.org/img/wn/${icon}.png">
                          </div>
                          <div>
                              <p id="forecast-desc">${forecast}</p>
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
                          </div>`;

          cardBody.appendChild(card);
          cardContainer.appendChild(cardBody);
          forecastList.appendChild(cardContainer);
        });
      });
  }

  function displayHistory() {
    var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    var cityHistory = document.getElementById("history");

    cityHistory.innerHTML = "";

    for (i = 0; i < savedCities.length; i++) {
      var historyBtn = document.createElement("button");
      historyBtn.classList.add("btn", "btn-primary", "col-12", "my-2", "history-city");
      historyBtn.innerHTML = `${savedCities[i].city}`;
      cityHistory.appendChild(historyBtn);
    }
    $(".history-city").on("click", function (event) {
      event.preventDefault();
      var cityName = $(this).text();
      getWeather(cityName);
    });
  }

  function emptyCurrentWeather() {
    
    var cardHeader = document.querySelector(".card-header");
    cardHeader.innerHTML = "";

    var currentWeatherContainer = document.querySelector("#current-weather");
    currentWeatherContainer.innerHTML = "";

    var forecastList = document.querySelector("#forecast-list");
    forecastList.innerHTML = "";

    return;
  }

  function clearHistory(event) {
    event.preventDefault();
    var cityHistory = document.getElementById("history");
    cityHistory.innerHTML = "";
    localStorage.removeItem("cities");
  }

  searchBtn.on("click", function() {
    var cityName = citySearch.val().trim();
    getWeather(cityName);
  });
  
  clearBtn.on("click", clearHistory);
  
});
