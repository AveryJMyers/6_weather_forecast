var apiKey = '8aac2c1bb4f228ebf4a3ecf51e0e6e58';

var searchBtn = document.getElementById('searchButton')
var searchTxt = document.getElementById('searchText')
var clearHistoryBtn = document.getElementById('clearHistory')
var forecastContainer = document.getElementById('forecastContainer')
var liveForecast = document.getElementById('liveForecast')
var fiveDayForecast = document.getElementById('fiveDayForecast')


//functions
function submitButton() {
    // console.log('hit submit button')
    city = searchTxt.value
    createHistory(city)
    getWeather(city)
    searchTxt.value=''
}

function createHistory(city) {
  var history = JSON.parse(localStorage.getItem('history')) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem('history', JSON.stringify(history));
    // console.log('added to history!');
  } else {
    console.log('city already in history'); // this makes no sense, work on improving this
  }
}
function generateHistory() {
  var history = JSON.parse(localStorage.getItem('history')) || [];
  var historyList = document.getElementById('historyList');

  if (!history.length) {
      console.log('no history to display');
  } else {
      for (var i = 0; i < history.length; i++) {
          var recentSearch = history[i];
          var listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.textContent = recentSearch;
          listItem.addEventListener('click', function() {
              city = this.textContent;
              getWeather(city);
          });
          historyList.appendChild(listItem);
      }
  }
}

function getWeather(city) {
    var weatherURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=30&appid=8aac2c1bb4f228ebf4a3ecf51e0e6e58`;
    fetch(weatherURL)
        .then(response => {
            if (!response.ok) {
            console.log('Could not get location data');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                console.log('Location data is empty');
            }
            let lat = data[0].lat;
            let lon = data[0].lon;
   
            cityConversion(lat,lon);
        })
        .catch(err => {
            console.error(err);
        });
}

function cityConversion(lat,lon){

    var cityURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(cityURL)
        .then(response => {
            if (!response.ok) {
            console.log('Could not get location data');
            }
            return response.json();
        })
        .then(data => {
       
            const cityName = data.city.name;
            const cityWeather = data.list[0].main.temp;
            const cityWindSpeed = data.list[0].wind.speed;
            const cityHumidity = data.list[0].main.humidity;
            const weatherIcon = data.list[0].weather[0].icon;
            const cityDate = data.list[0].dt_txt;
            const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
            const formattedDate = new Date(cityDate).toLocaleDateString(undefined, options);
            generateCard(cityName, cityWeather, cityWindSpeed, cityHumidity, weatherIcon, formattedDate);
            futureForcast(data);
        })
        .catch(err => {
            console.error(err);
        });
}

function generateCard(cityName, cityWeather, cityWindSpeed, cityHumidity, weatherIcon, formattedDate){
  forecastContainer.innerHTML = `
  <div class="card">
    <div class="card-header">
      ${cityName}
    </div>
    <div class="card-body">
      <img class="weatherIcon" src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="icon">
      <h5 class="card-title">${cityWeather}°F</h5>
      <p class="card-text">${cityHumidity}% Humidity</p>
      <p class="card-text">Wind Speed: ${cityWindSpeed}mph</p>
    </div>
    <div class="card-footer text-muted">
      Today's Weather!
    </div>
  </div>`;
}

function futureForcast(data){

  
  for (let i = 1; i < 40; i += 8) {
    const cityName = data.city.name;
    const cityWeather = data.list[i].main.temp;
    const cityHumidity = data.list[i].main.humidity;
    const cityWindSpeed = data.list[i].wind.speed;
    const weatherIcon = data.list[i].weather[0].icon;
    const cityDate = data.list[i].dt_txt;
    const options = { weekday: 'long', month: 'numeric', day: 'numeric' };
    const formattedDate = new Date(cityDate).toLocaleDateString(undefined, options);

    
    const card = document.createElement('div');
    card.classList.add('card',);
    card.innerHTML = `
      <div class="card-header">
        ${cityName}
      </div>
      <div class="card-body">
        <img class="weatherIcon" src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="icon">
        <h5 class="card-title">${cityWeather}°F</h5>
        <p class="card-text">${cityHumidity}% Humidity</p>
        <p class="card-text">Wind Speed: ${cityWindSpeed}mph</p>
      </div>
      <div class="card-footer text-muted">
        ${formattedDate}
      </div>`;
    forecastContainer.appendChild(card);
  }
}

function generateForecast(cityName, cityWeather, cityWindSpeed, cityHumidity, weatherIcon, formattedDate){
  forecastContainer.innerHTML = 
  `<div class="card">
    <div class="card-header">
      ${cityName}
    </div>
    <div class="card-body">
      <h5 class="card-title">${cityWeather}</h5>
      <p class="card-text">Humidity: ${cityHumidity}</p>
       <img class="weatherIcon" src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="icon">
      <p class="card-text">Wind Speed: ${cityWindSpeed}</p>
    </div>
    <div class="card-footer text-muted">
      ${formattedDate}
    </div>
  </div>`;
}


  

function clearHistory() {
    var history = JSON.parse(localStorage.getItem('history'));
    if (!history) {
      console.log('no history to delete');
    } else {
      localStorage.removeItem('history');
    }
  }

//function calls

generateHistory(); // gets history from local storage and displays it

searchBtn.onclick = submitButton;
clearHistoryBtn.onclick = clearHistory;

