  /* Displays any cities already in local storage */
  displayHistory();

  var citySearch = $(".city-search");
  var searchBtn = $(".search-button");
  var clearBtn = $(".clear-button");
  var apiKey = "eac8b0ada86d323c106004da27e70b99";

  /* This function clears previous data and uses the city name to construct the API call to openweather */ 
  function getWeather(cityName) {
    emptyCurrentWeather();
    
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    /* This is the api call to get the current weather */
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        /* This fills in the city name and current date */
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
        /* The following section fills in the current forecast for that city */
        var currentTemp = Math.round(data.main.temp);
        var currentForecastIcon = data.weather[0].icon;
        var currentWeatherState = data.weather[0].main;
        var currentHighTemp = Math.round(data.main.temp_max);
        var currentLowTemp = Math.round(data.main.temp_min);
        var currentWindSpeed = Math.round(data.wind.speed);
        var currentHumidity = data.main.humidity;
        var currentWeatherContainer = document.querySelector("#current-weather");

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
        /* The city info is then added to local storage  */
        var cityInfo = {
          city: cityName,
          lat: data.coord.lat,
          lon: data.coord.lon,
        };
        /* This function prevents redundant city objects being created */
        var existingCityInfo = savedCities.find(function (savedCityInfo) {
          return savedCityInfo.city === cityName;
        });

        if (!existingCityInfo) {
          savedCities.push(cityInfo);
          localStorage.setItem("cities", JSON.stringify(savedCities));
        }
        /* The information is then passed to this function to get the 5-day forecast */
        getForecast(apiKey, cityName, cityInfo.lat, cityInfo.lon);
        /* This function creates buttons for each city in local storage */
        displayHistory();

        return cityInfo;
      });
  }
  /* This function gets the 5-day forecast for the selected city */
  function getForecast(apiKey, cityName, lat, lon) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    /* This if a the forecast fetch with the constructed api url */
    fetch(forecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        /* This selects the items to accurately show the next 5 days */
        var array = [5, 13, 21, 29, 37];

        var selectedItems = data.list.filter(function (item, index) {
          return array.includes(index);
        });
        /* This function converts each item selected in the array and creates the forecast cards with the relevant information */
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
  /* This function pulls any city searches from history and creates buttons in the history section */
  function displayHistory() {
    var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    var cityHistory = document.getElementById("history");

    cityHistory.innerHTML = "";
    /* This creates the button for each object in the local storage with the city name */
    for (i = 0; i < savedCities.length; i++) {
      var historyBtn = document.createElement("button");
      historyBtn.classList.add(
        "btn",
        "btn-primary",
        "col-12",
        "my-2",
        "history-city"
      );
      historyBtn.innerHTML = `${savedCities[i].city}`;
      cityHistory.appendChild(historyBtn);
    }

    var historyBtn = $(".history-city");
    /* This even listener makes each city button re-launch the forecast call */
    $(".history-city").on("click", function (event) {
      event.preventDefault();
      var cityName = $(this).text();
      getWeather(cityName);
    });
  }
  /* This function empties out the current weather and forecast containers */
  function emptyCurrentWeather() {
    var cardHeader = document.querySelector(".card-header");
    cardHeader.innerHTML = "";

    var currentWeatherContainer = document.querySelector("#current-weather");
    currentWeatherContainer.innerHTML = "";

    var forecastList = document.querySelector("#forecast-list");
    forecastList.innerHTML = "";

    return;
  }
  /* This function clears the history and empties local storage */
  function clearHistory(event) {
    event.preventDefault();
    var cityHistory = document.getElementById("history");
    cityHistory.innerHTML = "";
    localStorage.removeItem("cities");
  }
  /* This function searches for the city put into the input field */
  function searchForCity(event) {
    event.preventDefault();
    console.log(citySearch.val().trim());
    var cityName = citySearch.val().trim();
    console.log(cityName);
    getWeather(cityName);
  }
  /* This is the event listener to search for a city */
  searchBtn.on("click", searchForCity);

  
  /* This is the event listener to clear the search history */
  clearBtn.on("click", clearHistory);

