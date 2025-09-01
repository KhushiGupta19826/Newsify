
const NEWS_API_KEY = "be7c6e11aaf040d19868946a4260acb4";
const WEATHER_API_KEY = "29c2b524b950dbc23b18ed9c922276b4";

const NEWS_API_URL = "https://newsapi.org/v2/everything?q=";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";


const newsContainer = document.getElementById("news-container");
const weatherContainer = document.getElementById("weather-container");

const searchNewsInput = document.getElementById("search-news");
const searchWeatherInput = document.getElementById("search-weather");

const searchNewsBtn = document.getElementById("btn-news");
const searchWeatherBtn = document.getElementById("btn-weather");


async function fetchNews(topic = "technology") {
  try {
    const response = await fetch(
      `${NEWS_API_URL}${topic}&apiKey=${NEWS_API_KEY}`
    );
    const data = await response.json();

    newsContainer.innerHTML = ""; // clear old results

    if (data.articles && data.articles.length > 0) {
      data.articles.slice(0, 6).forEach((article) => {
        const card = document.createElement("div");
        card.classList.add("news-card");
        card.innerHTML = `
          <img src="${article.urlToImage || "https://via.placeholder.com/300"}" alt="news" />
          <h3>${article.title}</h3>
          <p>${article.description || ""}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(card);
      });
    } else {
      newsContainer.innerHTML = "<p>No news found.</p>";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}


async function fetchWeather(city = "Delhi") {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      weatherContainer.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    weatherContainer.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>🌡️ ${data.main.temp} °C</p>
      <p>☁️ ${data.weather[0].description}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind: ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    console.error("Error fetching weather:", error);
    weatherContainer.innerHTML = "<p>Failed to load weather.</p>";
  }
}


searchNewsBtn.addEventListener("click", () => {
  const topic = searchNewsInput.value.trim();
  fetchNews(topic || "technology");
});

searchWeatherBtn.addEventListener("click", () => {
  const city = searchWeatherInput.value.trim();
  fetchWeather(city || "Delhi");
});


fetchNews();
fetchWeather();
