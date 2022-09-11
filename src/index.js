let now = new Date();
let day = now.getDay();
let hour = now.getHours();
let minutes = now.getMinutes();

if (minutes < 10) {
  minutes = `0${minutes}`;
}
if (hour < 10) {
  hour = `0${hour}`;
}

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

day = days[now.getDay()];

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col-2">
    <div class="forecast-date">
      ${formatDay(forecastDay.dt)}
      </div>
    <img
      src="https://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"
      alt="Clear"
      id="icon"
      width="60"
    />
    <div class="forecast-temp">
      <span class="forecast-temp-high">
        ${Math.round(forecastDay.temp.max)}°
      </span>
      <span class="forecast-temp-low">
        ${Math.round(forecastDay.temp.min)}°
      </span>
    </div>
  </div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function changeCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#input-city");
  let city = document.querySelector("h1");
  city.innerHTML = `${cityInput.value}`;
  searchCity(city);
}

function getForecast(coordinates) {
  let apiKey = "a43564c91a6c605aeb564c9ed02e3858";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showForecast);
}

function currentWeather(response) {
  let iconElement = document.querySelector("#icon");

  document.querySelector("#current-city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  iconElement.setAttribute("alt", response.data.weather[0].description);

  celsiusTemp = response.data.main.temp;

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "82d3803539a315ccbf8af1fb1b70dcc6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(currentWeather);
}

function submitCity(event) {
  event.preventDefault();
  let city = document.querySelector("#input-city").value;
  searchCity(city);
}

function location(position) {
  let apiKey = "82d3803539a315ccbf8af1fb1b70dcc6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(currentWeather);
}

function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(location);
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = Math.round(fahrenheitTemp);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = Math.round(celsiusTemp);
}

let city = document.querySelector("#enter-city");
city.addEventListener("submit", changeCity);

let dateTime = document.querySelector("h2");
dateTime.innerHTML = `${day} ${hour}:${minutes}`;

let search = document.querySelector("#enter-city");
search.addEventListener("submit", submitCity);

let showCurrentLocation = document.querySelector("#current-info");
showCurrentLocation.addEventListener("click", currentLocation);

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemp);

searchCity("Waterloo");

showForecast();
