const API_KEY = 'd2497c1d037baf6eb3c558b4173faea6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

let currentCity = 'Jakarta';
let units = 'metric';
let updateInterval;
let favoritesData = JSON.parse(localStorage.getItem('weatherFavoritesData')) || [];

const cityInput = document.getElementById('cityInput');
const loadingIndicator = document.getElementById('loadingIndicator');
const weatherContent = document.getElementById('weatherContent');
const errorMessage = document.getElementById('errorMessage');
const unitToggleBtn = document.getElementById('unitToggle');
const themeToggleSwitch = document.getElementById('themeToggleSwitch');
const btnFavorite = document.getElementById('btnFavorite');

document.addEventListener('DOMContentLoaded', () => {
    themeToggleSwitch.checked = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    loadFavoritesUI();
    getWeatherData(currentCity);
    startRealTimeUpdate();

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
});

themeToggleSwitch.addEventListener('change', () => {
    const html = document.documentElement;
    if (themeToggleSwitch.checked) {
        html.setAttribute('data-bs-theme', 'dark');
    } else {
        html.setAttribute('data-bs-theme', 'light');
    }
});

unitToggleBtn.addEventListener('click', () => {
    units = units === 'metric' ? 'imperial' : 'metric';
    unitToggleBtn.innerText = units === 'metric' ? '°C' : '°F';
    getWeatherData(currentCity);
    refreshFavoritesData();
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        currentCity = city;
        getWeatherData(city);
        cityInput.value = '';
        cityInput.blur();
    }
}

function manualRefresh() {
    getWeatherData(currentCity);
}

function startRealTimeUpdate() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
        getWeatherData(currentCity);
        refreshFavoritesData();
    }, 300000);
}

async function getWeatherData(city) {
    showLoading(true);
    errorMessage.classList.add('d-none');

    try {
        const currentResponse = await fetch(`${BASE_URL}/weather?q=${city}&units=${units}&lang=id&appid=${API_KEY}`);
        if (!currentResponse.ok) throw new Error(`Kota "${city}" tidak ditemukan.`);
        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(`${BASE_URL}/forecast?q=${city}&units=${units}&lang=id&appid=${API_KEY}`);
        const forecastData = await forecastResponse.json();

        updateCurrentUI(currentData);
        updateForecastUI(forecastData);
        checkFavoriteStatus(currentData.name);
        updateFavoriteItemData(currentData);

    } catch (error) {
        errorMessage.innerText = "Gagal memuat data: " + error.message;
        errorMessage.classList.remove('d-none');
    } finally {
        showLoading(false);
    }
}

function updateCurrentUI(data) {
    document.getElementById('locationName').innerText = `${data.name}, ${data.sys.country}`;

    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('currentTime').innerText = now.toLocaleDateString('id-ID', options);
    document.getElementById('lastUpdatedTime').innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    document.getElementById('currentTemp').innerText = Math.round(data.main.temp);

    const desc = data.weather[0].description;
    document.getElementById('weatherDesc').innerText = desc.replace(/\b\w/g, l => l.toUpperCase());

    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('windSpeed').innerText = Math.round(data.wind.speed);

    const visibilityKm = (data.visibility / 1000).toFixed(1);
    document.getElementById('visibility').innerText = visibilityKm;

    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const unitSymbol = units === 'metric' ? '°C' : '°F';
    const speedSymbol = units === 'metric' ? 'km/j' : 'mph';
    document.querySelectorAll('.unit-disp').forEach(el => el.innerText = unitSymbol);
    document.querySelector('.speed-unit').innerText = speedSymbol;
}

function updateForecastUI(data) {
    const grid = document.getElementById('forecastGrid');
    grid.innerHTML = '';

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecasts.slice(0, 5).forEach(day => {
        const dateDay = new Date(day.dt * 1000).toLocaleDateString('id-ID', { weekday: 'short' });
        const tempMax = Math.round(day.main.temp_max);
        const tempMin = Math.round(day.main.temp_min - 2);

        const icon = day.weather[0].icon;
        const desc = day.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());;

        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card h-100 text-center p-3 border-0 forecast-card">
                <div class="fw-medium mb-2 adaptive-text">${dateDay}</div>
                <img src="https://openweathermap.org/img/wn/${icon}.png" class="mx-auto forecast-icon" alt="${desc}">
                <div class="small mb-2 adaptive-text-50">${desc}</div>
                <div class="fw-bold adaptive-text"><span>${tempMax}°</span> <span class="adaptive-text-50 ms-2">${tempMin}°</span></div>
            </div>
        `;
        grid.appendChild(col);
    });
}

function showLoading(isLoading) {
    const el = document.getElementById('loadingIndicator');
    if (isLoading) el.classList.remove('d-none');
    else el.classList.add('d-none');
}

function toggleFavorite() {
    const index = favoritesData.findIndex(item => item.name === currentCity);

    if (index === -1) {
        const currentTemp = document.getElementById('currentTemp').innerText;
        const iconSrc = document.getElementById('weatherIcon').src;
        const iconCodeMatch = iconSrc.match(/wn\/(.+)@4x\.png/);
        const iconCode = iconCodeMatch ? iconCodeMatch[1] : '01d';

        favoritesData.push({
            name: currentCity,
            temp: currentTemp,
            icon: iconCode
        });
        btnFavorite.classList.add('active');
    } else {
        favoritesData.splice(index, 1);
        btnFavorite.classList.remove('active');
    }

    saveFavorites();
}

function updateFavoriteItemData(data) {
    const index = favoritesData.findIndex(item => item.name === data.name);
    if (index !== -1) {
        favoritesData[index].temp = Math.round(data.main.temp);
        favoritesData[index].icon = data.weather[0].icon;
        saveFavorites();
    }
}

async function refreshFavoritesData() {
    if (favoritesData.length === 0) return;

    const promises = favoritesData.map(item =>
        fetch(`${BASE_URL}/weather?q=${item.name}&units=${units}&lang=id&appid=${API_KEY}`)
            .then(res => res.json())
    );

    const results = await Promise.all(promises);
    results.forEach((data, index) => {
        if (data.cod === 200) {
            favoritesData[index].temp = Math.round(data.main.temp);
            favoritesData[index].icon = data.weather[0].icon;
        }
    });
    saveFavorites();
}

function checkFavoriteStatus(cityName) {
    currentCity = cityName;
    const isFavorite = favoritesData.some(item => item.name === cityName);
    if (isFavorite) {
        btnFavorite.classList.add('active');
    } else {
        btnFavorite.classList.remove('active');
    }
}

function saveFavorites() {
    localStorage.setItem('weatherFavoritesData', JSON.stringify(favoritesData));
    loadFavoritesUI();
}

function loadFavoritesUI() {
    const list = document.getElementById('favoritesList');
    const suggestions = document.getElementById('citySuggestions');

    list.innerHTML = '';
    suggestions.innerHTML = '';

    if (favoritesData.length === 0) {
        list.innerHTML = '<span class="text-muted small fst-italic px-3">Belum ada kota disimpan.</span>';
    }

    favoritesData.forEach(item => {
        const listItem = document.createElement('button');
        listItem.className = 'saved-city-item';
        const unitSymbol = units === 'metric' ? '°C' : '°F';

        listItem.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <img src="https://openweathermap.org/img/wn/${item.icon}.png" alt="icon" style="width: 30px; height: 30px;">
                <span class="city-name">${item.name}</span>
            </div>
            <span class="city-temp">${item.temp}${unitSymbol}</span>
        `;

        listItem.onclick = () => {
            currentCity = item.name;
            getWeatherData(item.name);
        };
        list.appendChild(listItem);

        const option = document.createElement('option');
        option.value = item.name;
        suggestions.appendChild(option);
    });
}