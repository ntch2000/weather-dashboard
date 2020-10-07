$(document).ready(function () {
  console.log("Hello");

  // DOM VARIABLES

  // JS VARIABLES

  var apiKey = "a804367293883745a69dec50c4a49813";

  var cityName = "atlanta";

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey;

  // FUNCTION DEFINITIONS

  function getWeather() {
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  }
  // FUNCTION CALLS
  getWeather();
  // EVENT LISTENERS
});
