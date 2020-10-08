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

  function searchCity() {
    cityName = $("#searchCity").val();
    console.log(cityName);
    var cityBtn = $("<button>")
      .attr("class", "list-group-item list-group-item-action")
      .text(cityName);
    $("#pastSearches").prepend(cityBtn);
  }

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

  $("#search").on("click", function (event) {
    event.preventDefault();
    searchCity();
  });
});
