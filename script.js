$(document).ready(function () {
  console.log("Hello");

  // DOM VARIABLES

  // JS VARIABLES

  var apiKey = "a804367293883745a69dec50c4a49813";

  var cityName;

  var currentDate;

  var cityLon;
  var cityLat;

  var temperature;

  var humidity;

  var windSpeed;

  var uvIndex;

  // FUNCTION DEFINITIONS

  function searchCity() {
    cityName = $("#searchCity").val();
    console.log(cityName);
    var cityBtn = $("<button>")
      .attr("class", "list-group-item list-group-item-action")
      .text(cityName);
    $("#pastSearches").append(cityBtn);

    getWeather(cityName);
  }

  function getWeather(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial" +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      cityLon = response.coord.lon;
      cityLat = response.coord.lat;

      // converts the unix UTC datetime to the current date
      currentDate = new Date(response.dt * 1000).toLocaleDateString();
      //console.log(currentDate);
      temperature = response.main.temp;
      humidity = response.main.humidity;

      //console.log(cityLon, cityLat);
      populateWeatherData();
    });
  }

  function populateWeatherData() {
    $("#city-name").text(cityName + " (" + currentDate + ")");
    $("#city-temp").text("Temperature: " + temperature + "\xB0F");
    $("#city-humidity").text("Humidity: " + humidity + "%");
  }
  // FUNCTION CALLS

  // EVENT LISTENERS

  $("#search").on("click", function (event) {
    event.preventDefault();
    searchCity();
  });
});
