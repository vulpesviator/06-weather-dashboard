var search = "";
var apiKey = "eac8b0ada86d323c106004da27e70b99";
var lat = "41.948438";
var lon = "-87.655333";
var cityName = "Chicago";
var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;


function getWeather(data) {

var currentTemp = document.querySelector("#current-temp")

fetch(apiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);

        var selectedCityTemp = data.main.temp;
        currentTemp.textContent(`${selectedCityTemp}\&deg;`)
    })
}

getWeather();