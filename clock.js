let is24Hour = false;


// =========================
// CLOCK
// =========================

function updateClock() {

    const now = new Date();

    const timeParts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Karachi",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
    }).formatToParts(now);

    const hours = Number(
        timeParts.find(part => part.type === "hour").value
    );

    const minutes = Number(
        timeParts.find(part => part.type === "minute").value
    );

    const seconds = Number(
        timeParts.find(part => part.type === "second").value
    );


    // AM / PM
    document.getElementById("ampm").textContent =
        hours >= 12 ? "PM" : "AM";


    // CLOCK HANDS
    const hourHand = document.querySelector(".hour-hand");
    const minuteHand = document.querySelector(".minute-hand");
    const secondHand = document.querySelector(".second-hand");


    const hourAngle =
        (hours % 12) * 30 + minutes * 0.5;

    const minuteAngle =
        minutes * 6 + seconds * 0.1;

    const secondAngle =
        seconds * 6;


    hourHand.style.transform =
        `translateX(-50%) rotate(${hourAngle}deg)`;

    minuteHand.style.transform =
        `translateX(-50%) rotate(${minuteAngle}deg)`;

    secondHand.style.transform =
        `translateX(-50%) rotate(${secondAngle}deg)`;


    // DATE
    const date = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Karachi",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(now);

    document.getElementById("date").textContent = date;
}


setInterval(updateClock, 1000);

updateClock();


// =========================
// 12 / 24 HOUR BUTTON
// =========================

const formatBtn = document.getElementById("formatBtn");

formatBtn.addEventListener("click", function () {

    is24Hour = !is24Hour;

    document.getElementById("ampm").style.display =
        is24Hour ? "none" : "block";

    formatBtn.textContent =
        is24Hour ? "12 Hour" : "24 Hour";
});


// =========================
// DARK / LIGHT MODE
// =========================

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

});


// =========================
// WEATHER
// =========================

let city = "Rawalpindi";


function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code >= 1 && code <= 3) {
        return "☁️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}


function getWeatherCondition(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "☁️ Cloudy";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️ Rain";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }

    if (code >= 80 && code <= 82) {
        return "🌧️ Rain Showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Weather";
}


// =========================
// GET WEATHER
// =========================

async function getWeather() {

    try {

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        document.getElementById("condition").textContent =
    "Loading weather...";

        const locationData =
            await locationResponse.json();

     if (!locationData.results || locationData.results.length === 0) {
    document.getElementById("city").textContent =
        "Location not found";

    document.getElementById("condition").textContent =
        "Please enter a valid city";

    return;
}


        const location =
            locationData.results[0];

        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );


        const data =
            await response.json();


        // CITY NAME
        document.getElementById("city").textContent =
             `${location.name}, ${location.country}`;


        // TEMPERATURE
        document.getElementById("temperature").textContent =
            `${data.current.temperature_2m}°C`;


        // HUMIDITY
        document.getElementById("humidity").textContent =
            `Humidity: ${data.current.relative_humidity_2m}%`;


        // WIND
        document.getElementById("wind").textContent =
            `Wind: ${data.current.wind_speed_10m} km/h`;


        // CONDITION
        document.getElementById("condition").textContent =
            getWeatherCondition(
                data.current.weather_code
            );


        // ICON
        document.getElementById("weatherIcon").textContent =
            getWeatherIcon(
                data.current.weather_code
            );

    }

    catch (error) {

        console.log(error);

        document.getElementById("condition").textContent =
            "Weather unavailable";
    }
}


getWeather();


// =========================
// CLOCK DOTS
// =========================

function createClockDots() {

    const ticks =
        document.querySelector(".ticks");

    if (!ticks) {
        return;
    }

    ticks.innerHTML = "";


    const width =
        ticks.clientWidth;

    const height =
        ticks.clientHeight;

    const size =
        Math.min(width, height);

    const centerX =
        width / 2;

    const centerY =
        height / 2;


    // Dots close to border
    const radius =
        size / 2 - 8;


    for (let i = 0; i < 60; i++) {

        const dot =
            document.createElement("span");

        dot.className =
            "tick-dot";


        const angle =
            (i * 6) * Math.PI / 180;


        const x =
            centerX +
            radius * Math.sin(angle);

        const y =
            centerY -
            radius * Math.cos(angle);


        dot.style.left =
            `${x}px`;

        dot.style.top =
            `${y}px`;


        ticks.appendChild(dot);
    }
}


createClockDots();


// Recalculate dots when screen size changes

window.addEventListener("resize", function () {

    createClockDots();

});


// =========================
// LOCATION SEARCH
// =========================
locationBtn.addEventListener("click", async function () {

    const location =
        locationInput.value.trim();

    if (location === "") {
        document.getElementById("condition").textContent =
            "Please enter a city";
        return;
    }

   city = location;

locationBtn.textContent = "Searching...";
locationBtn.disabled = true;
console.log("Button disabled");

await getWeather();

locationBtn.textContent = "Search";
locationBtn.disabled = false;
});

locationInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        locationBtn.click();
    }

});