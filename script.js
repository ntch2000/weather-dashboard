$(document).ready(function () {
  console.log("Hello");

  // weather icon src url
  // http://openweathermap.org/img/wn/10d@2x.png

  // DOM VARIABLES

  // JS VARIABLES

  // sets the API key to access openweather
  var apiKey = "a804367293883745a69dec50c4a49813";

  // variables for the name of the city, weather icon, date, latitude/longitude, temperature, humidity, wind speed, and uv index
  var cityName;
  var icon;
  var currentDate;
  var cityLon;
  var cityLat;
  var temperature;
  var humidity;
  var windSpeed;
  var uvIndex;

  // empty array for keep search history and the last city searched
  var searchHistory = [];
  var currentCity;

  // FUNCTION DEFINITIONS

  // loads the saved search history and city information when the page is refreshed
  function loadSearchHistory() {
    var storedCities = JSON.parse(localStorage.getItem("history"));
    var storedCurrentCity = localStorage.getItem("currentCity");

    // populates the city search history buttons and executes the function to obtain the lat and lon of the last city searched
    if (storedCities && storedCurrentCity) {
      //console.log(storedCurrentCity);
      getCityLatLon(storedCurrentCity);
      for (var i = 0; i < storedCities.length; i++) {
        var cityBtn = $("<button>")
          .attr("class", " cityBtn list-group-item list-group-item-action")
          .text(storedCities[i]);
        $("#pastSearches").append(cityBtn);
      }
    }
  }

  // dynamically generates the search history buttons
  function searchCity() {
    cityName = $("#searchCity").val();
    $("#searchCity").val("");
    //console.log(cityName);
    var cityBtn = $("<button>")
      .attr("class", " cityBtn list-group-item list-group-item-action")
      .text(cityName);
    $("#pastSearches").append(cityBtn);
    $("#forecast-title").text("5-Day Forecast:");
    //$("#current-weather").addClass("border");

    // saves the searched city into local storage and as the current city
    currentCity = cityName;
    searchHistory.push(cityName);

    localStorage.setItem("currentCity", currentCity);
    localStorage.setItem("history", JSON.stringify(searchHistory));

    // executes the function to obtain the latitude and longitude of the city searched to be passed into the getWeatherForecast function
    getCityLatLon(cityName);
  }

  // function to obtain the latitude and longitude of the searched city
  function getCityLatLon(city) {
    // setting the query url for the API call
    var queryUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial" +
      "&appid=" +
      apiKey;

    // ajax API call to retrieve the city coordinates
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (response) {
      //console.log(response);

      //console.log(icon);
      cityLon = response.coord.lon;
      cityLat = response.coord.lat;

      // converts the unix UTC datetime to the current date

      currentDate = new Date(response.dt * 1000).toLocaleDateString();
      //console.log(cityLon, cityLat);
      $("#city-name").text(city + " (" + currentDate + ")");

      getWeatherForecast(cityLat, cityLon);
    });
  }

  // obtains all the weather information for the city that was searched
  function getWeatherForecast(lat, lon) {
    // sets the url for the API call with the passed in latitude and longitude
    var forecastURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly,alerts&units=imperial&appid=" +
      apiKey;

    //ajax API call to retrieve weather forecast data
    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      // sets the weather statistics from the API response
      temperature = response.current.temp;
      humidity = response.current.humidity;
      windSpeed = response.current.wind_speed;
      uvIndex = response.current.uvi;

      // calls function to populate html pages with weather data
      populateWeatherData(response);
    });
  }

  function populateWeatherData(weatherObj) {
    console.log(weatherObj.current.weather[0].icon);

    // gets the weather icon information from the API response
    icon = weatherObj.current.weather[0].icon;

    // sets the url for the weather icons
    var cityWeatherUrl = "https://openweathermap.org/img/wn/" + icon + ".png";

    //console.log(weatherObj);
    $("#weatherIcon").attr("src", cityWeatherUrl);
    $("#city-temp").text("Temperature: " + temperature + "\xB0F");
    $("#city-humidity").text("Humidity: " + humidity + "%");
    $("#city-wind").text("Wind Speed: " + windSpeed + " MPH");

    // set conditional for uv index colors
    // 0 - 2: favorable/low
    // 3 - 5: moderate
    // > 6: severe

    if (uvIndex < 3) {
      $("#city-uvi").html(
        "UB Index: <span class='favorable p-2'>" + uvIndex + "</span>"
      );
    } else if (uvIndex > 6) {
      $("#city-uvi").html(
        "UB Index: <span class='severe p-2'>" + uvIndex + "</span>"
      );
    } else {
      $("#city-uvi").html(
        "UB Index: <span class='moderate p-2'>" + uvIndex + "</span>"
      );
    }
    // $("#city-uvi").append($("<span>").text("UV Index: " + uvIndex));

    for (i = 1; i < weatherObj.daily.length - 2; i++) {
      // set date for each forecast day
      var dailyDate = new Date(
        weatherObj.daily[i].dt * 1000
      ).toLocaleDateString();
      // set weather icon -- need to add to function call
      var dailyIcon =
        "https://openweathermap.org/img/wn/" +
        weatherObj.daily[i].weather[0].icon +
        ".png";
      //console.log(dailyIcon);
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

  loadSearchHistory();

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

    localStorage.setItem("currentCity", $(this).text());
    getCityLatLon($(this).text());
  });
});
