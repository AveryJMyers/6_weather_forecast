var apiKey = "8aac2c1bb4f228ebf4a3ecf51e0e6e58";

var searchBtn = document.getElementById('searchButton')
var searchTxt = document.getElementById('searchText')
var clearHistoryBtn = document.getElementById('clearHistory')



//functions
function submitButton() {
    console.log('hit submit button')
    city = searchTxt.value
    createHistory()
    getWeather(city)
    searchTxt.value=''
}
function cityClick(city) {
    console.log('clicked on ' + city);
    getWeather(city);
  }

function createHistory(){
    var history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(city)
    localStorage.setItem('history', JSON.stringify(history));
    console.log('added to history!')
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
            cityClick(recentSearch);
        });
        historyList.appendChild(listItem);
      }
    }
  }

  function getWeather(city) {
    console.log('hit get weather');
    console.log(city);
    var weatherURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=30&appid=${apiKey}`;
    fetch(weatherURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not get location data');
        }
        return response.json();
      })
      .then(data => {
        if (!data || data.length === 0) {
          throw new Error('Location data is empty');
        }
        let lat = data[0].lat;
        let lon = data[0].lon;
        console.log(lat + ' ' + lon);
      })
      .catch(error => {
        console.log('There was a problem fetching weather data: ', error.message);
      });
  }

  

function clearHistory() {
    console.log('hit clear history');
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

