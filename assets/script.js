let responseText = document.getElementById("response-text");
let buttonEl = $("#searchButton");
let inputEl = $("#cityName");
let citiesListEl = $("#citiesList");
let forcastEl = $("#forecast");
let placeholder = $("#placeholder");
let citiesList = JSON.parse(localStorage.getItem("cities")) ?? {};
let cityNameEl = document.createElement("h1");
let iconEl = document.createElement("img");
let tempEl = document.createElement("p");
let windEl = document.createElement("p");
let humidityEl = document.createElement("p");
let cardEl = $(".card");
let count = 0;

let appendCities = function () {
  for (const key in citiesList) {
    let cityButton = document.createElement("button");
    cityButton.innerHTML = key;
    cityButton.setAttribute("class", "d-flex");
    cityButton.setAttribute("id", "cityID");
    cityButton.setAttribute(
      "style",
      "margin-left: 2%; justify-content: center; margin-top: 2%; width: 65%;"
    );
    citiesListEl.append(cityButton);
  }
};

function getCurrentW(requestUrl) {
  let current = true;
  fetch(requestUrl)
    .then(function (response) {
      if (response.status === 404) {
        current = false;
        let keys = Object.keys(citiesList);
        if (count < 1) {
          delete citiesList[keys[keys.length - 1]];
          count++;
        }
        localStorage.setItem("cities", JSON.stringify(citiesList));
      } else {
        return response.json();
      }
    })
    .then(function (data) {
      if (current === false) {
        window.alert("Error 404 city not found");
        cityButton.removeChild(lastElementChild);
        return;
      }
      placeholder.text("");
      let cityName = data.name;
      let currentTempR = data.main.temp;
      let currentWind = data.wind.speed;
      let humidityV = data.main.humidity;
      cityNameEl.innerHTML = "";
      iconEl.src = "";
      tempEl.innerHTML = "";
      iconEl.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      iconEl.setAttribute("class", "d-inline");
      cityNameEl.textContent = `Today's Forecast for ${cityName}`;
      cityNameEl.setAttribute("class", "d-inline");
      forcastEl.append(cityNameEl);
      forcastEl.append(iconEl);
      tempEl.setAttribute("style", "margin-left: 2%;");
      tempEl.textContent = `Current Temperature: ${currentTempR} F`;
      windEl.setAttribute("style", "margin-left: 2%;");
      windEl.textContent = `Current Wind Speed: ${currentWind} MPH`;
      humidityEl.setAttribute("style", "margin-left: 2%;");
      humidityEl.textContent = `Current Humidity: ${humidityV} %`;
      forcastEl.append(tempEl);
      forcastEl.append(windEl);
      forcastEl.append(humidityEl);
      let requestUrl3 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&id=524901&appid=d6c6f2f334d8420a6173b353ed5724d3`;
      fetch(requestUrl3)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          let currentTempR;
          let currentWind;
          let humidityV;
          for (let i = 0; i < data.list.length; i++) {
            let currentITime = data.list[i].dt_txt;
            let myDateArr2 = currentITime.split(" ");
            if (myDateArr2[1] == "12:00:00") {
              list = i;
              i = data.list.length;
            }
          }
          for (let i = 1; i <= cardEl.length; i++) {
            let currentCardEl = $(`#${i}`);
            let iconEl2 = document.createElement("img");
            currentWind = data.list[list].wind.speed;
            currentTempR = data.list[list].main.temp;
            humidityV = data.list[list].main.humidity;
            iconEl2.src = `https://openweathermap.org/img/w/${data.list[list].weather[0].icon}.png`;
            let currentDate = data.list[list].dt_txt;
            let myDateArr = currentDate.split(" ");
            currentCardEl[0].children[0].children[0].innerText = myDateArr[0];
            currentCardEl[0].children[0].children[0].append(iconEl2);
            currentCardEl[0].children[0].children[1].innerText = `Temp: ${currentTempR} °F\n`;
            currentCardEl[0].children[0].children[1].innerText += `Wind: ${currentWind} MPH\n`;
            currentCardEl[0].children[0].children[1].innerText += `Humidity: ${humidityV} %`;
          }
        });
    });
}

appendCities();
if (Object.keys(citiesList)[0]) {
  let requestUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${
    Object.keys(citiesList)[0]
  }&units=imperial&id=524901&appid=d6c6f2f334d8420a6173b353ed5724d3`;
  getCurrentW(requestUrl1);
} else {
  placeholder.text("Current Day Forecast");
}

buttonEl.on("click", function () {
  let currentCityName = inputEl.val();
  citiesList[currentCityName] = 1;
  localStorage.setItem("cities", JSON.stringify(citiesList));
  let requestUrl2 = `https://api.openweathermap.org/data/2.5/weather?q=${currentCityName}&units=imperial&id=524901&appid=d6c6f2f334d8420a6173b353ed5724d3`;
  getCurrentW(requestUrl2);
  let cityButton = document.createElement("button");
  cityButton.innerHTML = currentCityName;
  cityButton.setAttribute("class", "d-flex");
  cityButton.setAttribute("id", "cityID");
  cityButton.setAttribute(
    "style",
    "margin-left: 2%; justify-content: center; margin-top: 2%; width: 65%;"
  );
  citiesListEl.append(cityButton);
});

citiesListEl.on("click", function (event) {
  let currentCityName = event.target.innerHTML;
  let requestUrl2 = `https://api.openweathermap.org/data/2.5/weather?q=${currentCityName}&units=imperial&id=524901&appid=d6c6f2f334d8420a6173b353ed5724d3`;
  getCurrentW(requestUrl2);
});
