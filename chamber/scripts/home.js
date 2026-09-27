/* ---------- Member spotlights (reuses getMembers/memberCardMarkup from common.js) ---------- */

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

async function initSpotlights() {
    const container = document.querySelector("#spotlights");
    if (!container) return;

    try {
        const members = await getMembers();
        const eligible = members.filter(
            (member) => member.membership === 3 || member.membership === 2
        );
        const count = eligible.length >= 3 ? 3 : Math.min(2, eligible.length);
        const chosen = shuffle(eligible).slice(0, count);

        container.innerHTML = chosen.map(memberCardMarkup).join("");
    } catch (error) {
        container.innerHTML =
            "<p>Member spotlights are unavailable right now. Please try again shortly.</p>";
        console.error("Failed to load spotlights:", error);
    }
}

/* ---------- Weather (OpenWeatherMap current + 5 day / 3 hour forecast) ---------- */

const WEATHER_API_KEY = "6ca3254789384bb686bff682c5d84f27";

// Benin City, Edo State, Nigeria (2 decimal places, per course guidance)
const WEATHER_LAT = 6.34;
const WEATHER_LON = 5.60;
const WEATHER_UNITS = "metric";

const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
const FORECAST_WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;

function weatherIconUrl(code) {
    return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

function renderCurrentWeather(data) {
    const nowEl = document.querySelector("#weather-now");
    if (!nowEl) return;

    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    nowEl.innerHTML = `
    <img src="${weatherIconUrl(icon)}" alt="${description}" width="64" height="64" />
    <div>
      <p class="temp-now">${temp}&deg;C</p>
      <p class="desc-now">${description}</p>
    </div>
  `;
}

function pickDailyForecast(list) {
    // 5 day / 3 hour forecast returns 40 entries (8 per day).
    // Group by date, keep the reading closest to midday, skip today,
    // and take the next 3 distinct days.
    const today = new Date().toISOString().slice(0, 10);
    const byDate = new Map();

    list.forEach((entry) => {
        const [date, time] = entry.dt_txt.split(" ");
        if (date === today) return;
        const hour = Number(time.split(":")[0]);
        const distanceFromNoon = Math.abs(hour - 12);
        const existing = byDate.get(date);
        if (!existing || distanceFromNoon < existing.distanceFromNoon) {
            byDate.set(date, { entry, distanceFromNoon });
        }
    });

    return [...byDate.values()].slice(0, 3).map(({ entry }) => entry);
}

function renderForecast(list) {
    const forecastEl = document.querySelector("#weather-forecast");
    if (!forecastEl) return;

    const days = pickDailyForecast(list);
    const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });

    forecastEl.innerHTML = days
        .map((entry) => {
            const date = new Date(entry.dt_txt.replace(" ", "T"));
            const label = formatter.format(date);
            const temp = Math.round(entry.main.temp);
            const icon = entry.weather[0].icon;
            const description = entry.weather[0].description;
            return `
        <li class="forecast-day">
          <span class="fc-label">${label}</span>
          <img src="${weatherIconUrl(icon)}" alt="${description}" width="40" height="40" />
          <span class="fc-temp">${temp}&deg;C</span>
        </li>
      `;
        })
        .join("");
}

async function initWeather() {
    const nowEl = document.querySelector("#weather-now");
    const forecastEl = document.querySelector("#weather-forecast");

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(CURRENT_WEATHER_URL),
            fetch(FORECAST_WEATHER_URL),
        ]);

        if (!currentResponse.ok) throw new Error(await currentResponse.text());
        if (!forecastResponse.ok) throw new Error(await forecastResponse.text());

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        renderCurrentWeather(currentData);
        renderForecast(forecastData.list);
    } catch (error) {
        if (nowEl) {
            nowEl.innerHTML =
                "<p>Weather data is unavailable right now. Please try again shortly.</p>";
        }
        if (forecastEl) forecastEl.innerHTML = "";
        console.error("Failed to load weather:", error);
    }
}

/* ---------- Init ---------- */

function initHome() {
    initSpotlights();
    initWeather();
}

document.addEventListener("DOMContentLoaded", initHome);