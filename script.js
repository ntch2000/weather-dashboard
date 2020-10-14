$(document).ready(function () {
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
  // boolean to track if a city has been searched and a button created
  var buttonCreated;

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
  function createCityButtons() {
    $("#searchCity").val("");
    var cityBtn = $("<button>")
      .attr("class", " cityBtn list-group-item list-group-item-action")
      .text(cityName);
    $("#pastSearches").append(cityBtn);
    $("#forecast-title").text("5-Day Forecast:");

    // saves the searched city into local storage and as the current city
    currentCity = cityName;
    searchHistory.push(cityName);

    localStorage.setItem("currentCity", currentCity);
    localStorage.setItem("history", JSON.stringify(searchHistory));

    // sets boolean to true after button is created
    buttonCreated = true;
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
    })
      .then(function (response) {
        cityLon = response.coord.lon;
        cityLat = response.coord.lat;

        // converts the unix UTC datetime to the current date
        currentDate = new Date(response.dt * 1000).toLocaleDateString();

        $("#city-name").text(city + " (" + currentDate + ")");
        // if a city button has not been created, creates the button and calls the getWeatherForecast function
        if (buttonCreated === false) {
          createCityButtons();
          getWeatherForecast(cityLat, cityLon);
        } else {
          // if a button has already been created, just called the getWeatherForecast function
          getWeatherForecast(cityLat, cityLon);
        }
      })
      .fail(function () {
        // if the ajax call fails, the input field is cleared and modal is shown indicating a valid city must be entered
        $(".error-modal").modal("show");
        $("#searchCity").val("");
      });
  }

  // obtains all the weather information for the city that was searched
  function getWeatherForecast(lat, lon) {
    buttonCreated = false;
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
    // gets the weather icon information from the API response
    icon = weatherObj.current.weather[0].icon;

    // sets the url for the weather icons
    var cityWeatherUrl = "https://openweathermap.org/img/wn/" + icon + ".png";

    $("#current-weather").addClass("border");
    // populates the weather data on the page
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
        "UV Index: <span class='favorable p-2'>" + uvIndex + "</span>"
      );
    } else if (uvIndex > 6) {
      $("#city-uvi").html(
        "UV Index: <span class='severe p-2'>" + uvIndex + "</span>"
      );
    } else {
      $("#city-uvi").html(
        "UV Index: <span class='moderate p-2'>" + uvIndex + "</span>"
      );
    }
    // clears the forecast cards before populating new cards
    $(".card-deck").empty();

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

      // set temp
      var dailyTemp = weatherObj.daily[i].temp.day;

      // set humidity
      var dailyHumidity = weatherObj.daily[i].humidity;

      createForecastCards(dailyDate, dailyIcon, dailyTemp, dailyHumidity);
    }
  }

  // creates the 5-day forecast information cards with the passed in values of date, weather icon url, temp, and humidity
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

  // loads the searched city buttons and the weather information from the last city searched on page load
  loadSearchHistory();

  // EVENT LISTENERS

  $("#search").on("click", function (event) {
    event.preventDefault();
    cityName = $("#searchCity").val();

    // sets the boolean to false since a button will not have been created when a user searched for a city
    buttonCreated = false;
    getCityLatLon(cityName);
  });

  // listens for any clicks on the city buttons
  $(document).on("click", ".cityBtn", function () {
    // city button has already been created so the boolean is set to true
    buttonCreated = true;

    localStorage.setItem("currentCity", $(this).text());
    getCityLatLon($(this).text());
  });
});
