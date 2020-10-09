$(document).ready(function () {
  console.log("Hello");

  // weather icon src url
  // http://openweathermap.org/img/wn/10d@2x.png

  // DOM VARIABLES

  // JS VARIABLES

  var apiKey = "a804367293883745a69dec50c4a49813";

  var cityName;
  var icon;

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
      .attr("class", " cityBtn list-group-item list-group-item-action")
      .text(cityName);
    $("#pastSearches").append(cityBtn);

    getCityLatLon(cityName);
  }

  function getWeatherForecast(lat, lon) {
    // https://api.openweathermap.org/data/2.5/onecall?lat=33.75&lon=-84.39&exclude=minutely,hourly,alerts&appid=a804367293883745a69dec50c4a49813

    // "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=" + apiKey

    var forecastURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly,alerts&units=imperial&appid=" +
      apiKey;

    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      //console.log(response);

      icon = response.current.weather[0].icon;
      // converts the unix UTC datetime to the current date

      //console.log(currentDate);
      temperature = response.current.temp;
      humidity = response.current.humidity;
      windSpeed = response.current.wind_speed;
      uvIndex = response.current.uvi;

      //   for (var i = 0; i < response.daily.length; i++) {
      //     var date = new Date(response.daily[i].dt * 1000).toLocaleDateString();

      //     console.log("Day 1: " + date);
      //  }
      populateWeatherData(icon, response);
    });
  }

  function getCityLatLon(city) {
    var queryUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial" +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      //console.log(response);

      //console.log(icon);
      cityLon = response.coord.lon;
      cityLat = response.coord.lat;
      currentDate = new Date(response.dt * 1000).toLocaleDateString();
      //console.log(cityLon, cityLat);
      $("#city-name").text(city + " (" + currentDate + ")");

      getWeatherForecast(cityLat, cityLon);
    });
  }

  function populateWeatherData(weatherIcon, weatherObj) {
    var cityWeatherUrl =
      "http://openweathermap.org/img/wn/" + weatherIcon + ".png";

    console.log(weatherObj);
    $("#weatherIcon").attr("src", cityWeatherUrl);
    $("#city-temp").text("Temperature: " + temperature + "\xB0F");
    $("#city-humidity").text("Humidity: " + humidity + "%");
    $("#city-wind").text("Wind Speed: " + windSpeed + " MPH");
    $("#city-uvi").text("UV Index: " + uvIndex);

    for (i = 1; i < weatherObj.daily.length - 2; i++) {
      // set date for each forecast day
      var dailyDate = new Date(
        weatherObj.daily[i].dt * 1000
      ).toLocaleDateString();
      // set weather icon -- need to add to function call
      var dailyIcon =
        "http://openweathermap.org/img/wn/" +
        weatherObj.daily[i].weather[0].icon +
        ".png";
      console.log(dailyIcon);
      // set temp
      var dailyTemp = weatherObj.daily[i].temp.day;

      // set humidity
      var dailyHumidity = weatherObj.daily[i].humidity;

      createForecastCards(dailyDate, dailyIcon, dailyTemp, dailyHumidity);
      //console.log(date);
    }
  }

  function createForecastCards(date, iconUrl, temp, humidity) {
    var forecastDiv = $("<div>").attr(
      "class",
      "card text-white bg-primary mb-3 p-2"
    );
    var forecastHeader = $("<h5>").attr("class", "card-title").text(date);

    var forecastIcon = $("<img>").attr({
      src: iconUrl,
      class: "forecast-img",
    });
    var forecastTemp = $("<p>")
      .attr("class", "card-text")
      .text("Temp: " + temp + " \xB0F");
    var forecastHumidity = $("<p>")
      .attr("class", "card-text")
      .text("Humidity: " + humidity + "%");
    forecastDiv.append(
      forecastHeader,
      forecastIcon,
      forecastTemp,
      forecastHumidity
    );
    $(".card-deck").append(forecastDiv);
  }
  // FUNCTION CALLS

  // EVENT LISTENERS

  $("#search").on("click", function (event) {
    event.preventDefault();
    $(".card-deck").empty();
    searchCity();
  });

  // listens for any clicks on the city buttons
  $(document).on("click", ".cityBtn", function () {
    console.log($(this).text());
    $(".card-deck").empty();
    getCityLatLon($(this).text());
  });
});
