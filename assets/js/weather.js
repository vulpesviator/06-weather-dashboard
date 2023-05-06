var search = "";
var apiKey = "eac8b0ada86d323c106004da27e70b99";
var lat = "41.948438";
var lon = "-87.655333";
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=eac8b0ada86d323c106004da27e70b99`;



fetch(apiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data.results);
    })