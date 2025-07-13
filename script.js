
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '10577a9d6d20d50e737bb45bdf0d462f'; // Replace with your OpenWeatherMap API key
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location-input');

    // Default location (can be changed)
    fetchWeather('London');

    searchBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeather(location);
        }
    });

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const location = locationInput.value.trim();
            if (location) {
                fetchWeather(location);
            }
        }
    });

    function fetchWeather(location) {
        // Current weather
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.cod !== 200) {
                    alert(`Error: ${data.message}`);
                    return;
                }
                updateCurrentWeather(data);
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`);
            })
            .then(response => response.json())
            .then(data => {
                if (data.cod !== "200") {
                    alert(`Error: ${data.message}`);
                    return;
                }
                updateForecast(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('Could not fetch weather data. Please try another location.');
            });
    }

    function updateCurrentWeather(data) {
        document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weather-description').textContent = capitalizeFirstLetter(data.weather[0].description);
        document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('precipitation').textContent = data.rain ? `${data.rain['1h'] || 0}%` : '0%';

        // Update weather icon
        const weatherIcon = document.querySelector('#weather-main .weather-icon i');
        const iconCode = data.weather[0].icon;
        weatherIcon.className = getWeatherIcon(iconCode);
    }

    function updateForecast(data) {
        const forecastContainer = document.getElementById('forecast-items');
        forecastContainer.innerHTML = '';

        // Get daily forecasts (every 24 hours)
        for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const forecastItem = document.createElement('div');
            forecastItem.className = 'flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3';
            forecastItem.innerHTML = `
                <div class="w-1/4">${dayName}</div>
                <div class="w-1/4 text-center text-2xl">
                    <i class="${getWeatherIcon(forecast.weather[0].icon)}"></i>
                </div>
                <div class="w-1/4 text-right">${Math.round(forecast.main.temp_max)}°</div>
                <div class="w-1/4 text-right opacity-70">${Math.round(forecast.main.temp_min)}°</div>
            `;

            forecastContainer.appendChild(forecastItem);
        }
    }

    function getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-showers-heavy',
            '10n': 'fas fa-cloud-showers-heavy',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };

        return iconMap[iconCode] || 'fas fa-question';
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
