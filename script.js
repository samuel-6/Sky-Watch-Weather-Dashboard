// This line adds a click event listener to the search button.
// When the search buton is clicked, it calls the "getWeatherInfo function".
// The function then will use the current value of the city input field.
document.getElementById('searchButton').addEventListener('click', () => getWeatherInfo());

// This code adds a click event listener to all elements with the class "cursors-pointer".
// When one of these elements is clicked, it calls the "getWeatherInfo" function with the text content of the clicked element.
// This is used to load the weather info for a city from the search history when the city's name is clicked.
document.querySelectorAll('.cursor-pointer').forEach(item => {

    item.addEventListener('click', () => getWeatherInfo(item.textContent.trim()));

})

// This line adds a click event listener to the search box.
// When the search box is clicked, it clears the current value only if it's the default "San Diego".
document.getElementById('cityBox').addEventListener('click', () => {

    if (document.getElementById('cityInput').value === "San Diego") {

        document.getElementById('cityInput').value = "";

    }

});

// The "getWeatherInfo" function takes a city name as an argument and fetches weather data for this city from the OpenWeather API.
// If no argument is provided, it uses the current value of the city input field.
// It also adds the city to the search history if it isn't already present.
function getWeatherInfo(cityName) {

    if (!cityName || cityName === 'Search') {

        cityName = document.getElementById('cityInput').value;

    }

    if (!cityName) return; // Stop function if cityName is empty.

    let API_KEY = "b98abc33577afa34f39ea5170c429c76";
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + API_KEY + "&units=imperial";
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + API_KEY + "&units=imperial";

    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {

            if (!data || !data.main || !data.weather || !data.weather[0]) return; // Check if data is valid.
            let main = data.main;
            document.getElementById('mainView').innerHTML = `

            <h1 class="font-mono font-black text-3xl text-black pt-2">${cityName} (${new Date().toLocaleDateString()}) ${getWeatherIcon(data.weather[0].main)}</h1>
            <p class="py-4">Temp: ${main.temp} °F</p>
            <p class="py-4">Wind: ${data.wind.speed} MPH</p>
            <p class="py-4">Humidity: ${main.humidity} %</p>

            `;

            addCityToAside(cityName);

        })
        .catch(err => console.error(err)); // Logs any errors.

    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {

            if (!data || !data.list || data.list.length < 1) return; // Ckecks if data is valid.
            for (let i = 1; i <= 5; i++) {

                let forecast = data.list[i * 8 - 1];
                document.getElementById(`dynamicCard${i}`).innerHTML = `

                <h3 class="font-black">${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
                <h4 class="py-2 text-4xl pl-4">${getWeatherIcon(forecast.weather[0].main)}</h4>
                <p class="py-2">Temp: ${forecast.main.temp} °F</p>
                <p class="py-2">Wind: ${forecast.wind.speed} MPH</p>
                <p class="py-2">Humidity: ${forecast.main.humidity} %</p>

                `;

            }

        })
        .catch(err => console.error(err)); // Logs any errors.

}

// The "addcityToAside" function takes a city name as an argument and adds it to the search history.
// If the city is already present in the search history, it does nothing.
function addCityToAside(cityName) {

    let aside = document.getElementById('searchHistory');
    let cityExists = Array.from(aside.children).some(child => child.textContent.trim() === cityName);

    if(!cityExists) {

        let newCity = document.createElement('div');
        newCity.textContent = cityName;
        newCity.classList.add('cursor-pointer');
        newCity.classList.add('my-4');
        newCity.classList.add('font-mono');
        newCity.classList.add('bg-gray-500');
        newCity.classList.add('text-center');
        newCity.classList.add('py-2');
        newCity.addEventListener('click', () => getWeatherInfo(cityName));
        aside.appendChild(newCity);

    }

}

// The "getWeatherIcon" function takes a weather description as an argument and returns a corresponding emoji.
// If the weather description doesn't match any of the known descriptions, it defaults to the sun emoji.
function getWeatherIcon(weather) {

    switch(weather) {

        case 'Clear':
            return '☀️';

        case 'Clouds':
            return '☁️';

        case 'Rain':
            return '🌧';

        case 'Snow':
            return '❄️';

        default:
            return '☀️';

    }

}

// This line calls the "getWeatherInfo" function and passes the "Atlanta" value as a default option.
getWeatherInfo('Atlanta');