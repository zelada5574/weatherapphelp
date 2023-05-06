// user input of the city they want to search
// Define variables to reference HTML elements
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const summary = document.getElementById("summary");
const forecastContainer = document.querySelector(".fiveday");
const historyList = document.querySelector(".history");

// Define API endpoint and API key
const apiEndpoint = "https://api.openweathermap.org/data/2.5/";
const apiKey = "f409dd1782101002b598dba2e37b0b89";

// Define function to fetch weather data from API
async function getWeatherData(city) {
  const response = await fetch(`${apiEndpoint}weather?q=${city}&units=metric&appid=${apiKey}`);
  const data = await response.json();
  return data;
}

// Define function to fetch forecast data from API
async function getForecastData(city) {
  const response = await fetch(`${apiEndpoint}forecast?q=${city}&units=metric&appid=${apiKey}`);
  const data = await response.json();
  return data;
}

// Define function to display weather data in summary element
function displayWeatherData(city, temperature, windSpeed, humidity, weatherIcon) {
  summary.innerHTML = `${city} - ${temperature}°C, ${windSpeed} km/h, ${humidity}% humidity`;
  const iconUrl = `./images/${weatherIcon}.png`;
  document.querySelector(".displaycity").style.backgroundImage = `url('${iconUrl}')`;
}
// Define function to display forecast data in cards
function displayForecastData(forecastData) {
  forecastContainer.innerHTML = "";
  forecastData.forEach((forecast) => {
    const date = new Date(forecast.dt_txt).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const temperature = Math.round(forecast.main.temp);
    const icon = forecast.weather[0].icon;
    const card = `
      <div class="card">
        <h3>${date}</h3>
        <p>${temperature}°C</p>
        <img src="./images/${icon}.png" alt="${forecast.weather[0].description}">
      </div>
    `;
    forecastContainer.insertAdjacentHTML("beforeend", card);
  });
}

// Define function to display search history
function displayHistory(history) {
  historyList.innerHTML = "";
  history.forEach((city) => {
    const item = `
      <li>${city}</li>
    `;
    historyList.insertAdjacentHTML("beforeend", item);
  });
}

// Define function to handle search button click
async function handleSearch() {
  // Get user input
  const city = searchInput.value.trim();

  // Get weather and forecast data from API
  const currentWeatherData = await getWeatherData(city);
  const forecastData = await getForecastData(city);

  // Display today's weather data
  const temperature = Math.round(currentWeatherData.main.temp);
  const windSpeed = Math.round(currentWeatherData.wind.speed);
  const humidity = currentWeatherData.main.humidity;
  displayWeatherData(city, temperature, windSpeed, humidity);

  // Display forecast data for next 5 days
  const forecastDataFor5Days = forecastData.list.filter((data) =>
    data.dt_txt.includes("12:00:00")
  );
  displayForecastData(forecastDataFor5Days);
  
  // Update search history
  const history = JSON.parse(localStorage.getItem("history")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory(history);
  }
}

// Attach event listener to search button
searchBtn.addEventListener("click", handleSearch);

// Display search history on page load
const history = JSON.parse(localStorage.getItem("history")) || [];
displayHistory(history);

// Define function to handle history item click
async function handleHistory(event) {
  const city = event.target.textContent;
  searchInput.value = city;
  await handleSearch();
}

// Attach event listener to history list
historyList.addEventListener("click", handleHistory);