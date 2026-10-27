const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
// De API-sleutel (apiKey) staat in config.js

weatherForm.addEventListener("submit", async event => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if(typeof apiKey === "undefined" || apiKey === "plak-hier-je-sleutel"){
        displayError("Vul eerst je API-sleutel in config.js in");
        return;
    }

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error.message);
        }
    }
    else{
        displayError("Voer een stad in");
    }
});

async function getWeatherData(city){

    // encodeURIComponent zorgt dat steden met spaties of tekens zoals é ook werken
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=nl`;

    const response = await fetch(apiUrl);

    if(response.status === 404){
        throw new Error("Stad niet gevonden");
    }
    if(response.status === 401){
        throw new Error("API-sleutel klopt niet");
    }
    if(!response.ok){
        throw new Error("Kon weerdata niet ophalen");
    }

    return await response.json();
}

function displayWeatherInfo(data){

    const {name: city,
           main: {temp, humidity},
           weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp.toFixed(1)}°C`;
    humidityDisplay.textContent = `Luchtvochtigheid: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈\uFE0F";
        case (weatherId >= 300 && weatherId < 400):
            return "🌦\uFE0F";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧\uFE0F";
        case (weatherId >= 600 && weatherId < 700):
            return "❄\uFE0F";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫\uFE0F";
        case (weatherId === 800):
            return "☀\uFE0F";
        case (weatherId >= 801 && weatherId < 810):
            return "☁\uFE0F";
        default:
            return "❓";
    }
}

function displayError(message){

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}
