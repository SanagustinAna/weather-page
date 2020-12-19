//Temperature change Celsius-Farenheit

function changeTemperatureCelsius(event) {
    event.preventDefault();
    let temperatureCelsius = document.querySelector('#main-temperature');
    celsiusLink.classList.add("active");
    farenheitLink.classList.remove("active");
    if (temperatureCelsius.className === "farenheit"){
        let temperatureNumber = parseInt(temperatureCelsius.textContent);
        let changeFormulaC = (temperatureNumber -32) / 1.8;
        temperatureCelsius.innerHTML = Math.round(changeFormulaC);
        temperatureCelsius.classList.replace("farenheit", "celsius");
    }
}

function changeTemperatureFarenheit(event) {
    event.preventDefault();
    let temperatureFareheit = document.querySelector('#main-temperature');
    farenheitLink.classList.add("active");
    celsiusLink.classList.remove("active");
    if (temperatureFareheit.className === "celsius"){
        let temperatureNumber = parseInt(temperatureFareheit.textContent);
        let changeFormulaF = (temperatureNumber * 1.8) + 32;
        temperatureFareheit.innerHTML = Math.round(changeFormulaF);
        temperatureFareheit.classList.replace("celsius", "farenheit"); 
    }
}


//Current hour
function updateDate(newDate){
    let daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let weekDay = daysArray[newDate.getDay()];
    let currentHour = newDate.getHours();
    let currentMinutes = newDate.getMinutes();
    let currentDate = document.querySelector("#date-label");
    if (currentMinutes < 10){
        currentDate.innerHTML = `${weekDay}, ${currentHour}:0${currentMinutes}`;
    }else{
        currentDate.innerHTML = `${weekDay}, ${currentHour}:${currentMinutes}`;
    }
}

updateDate(new Date());

//Search engine city

function getDataTemp(event){
    event.preventDefault();
    let searchCity = document.querySelector("#input-text");
    let currentCity = searchCity.value;
    let apiKey = 'b8460e3f37d976669c784023439cb3c3';
    let units = 'metric';
    let place = currentCity;
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}&units=${units}`;
    
    axios.get(apiURL).then(showDataCity);
    document.getElementById("search-city").reset();
    
}

function showDataCity(response){
    let icon = response.data.weather[0].icon;
    let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    let iconLabel = document.querySelector('#weather-img');
    iconLabel.setAttribute("src", iconURL);
    
    let city = response.data.name;
    let cityLabel = document.querySelector("#city-label")
    cityLabel.innerHTML = `${city}`;
    
    let temperature = Math.round(response.data.main.temp);
    let temperatureLabel = document.querySelector('#main-temperature');
    temperatureLabel.innerHTML = `${temperature}`;
    
    let weatherInfo = response.data.weather[0].description;
    let detailsLabel = document.querySelector('#weather-condition');
    detailsLabel.innerHTML = `${weatherInfo}`;
    
    let precipitations = response.data.clouds.all;
    let precipitationsLabel = document.querySelector('#precipitations-data');
    precipitationsLabel.innerHTML = `${precipitations}`;
    
    let humidity = Math.round(response.data.main.humidity);
    let humidityLabel = document.querySelector('#humidity-data');
    humidityLabel.innerHTML = `${humidity}`;
    
    let wind = Math.round(response.data.wind.speed);
    let windLabel = document.querySelector('#wind-data');
    windLabel.innerHTML = `${wind}`;

    let latitudePlace = response.data.coord.lat;
    let longitudePlace = response.data.coord.lon;
    searchPlaceForecast(latitudePlace, longitudePlace);

    let weatherMain = response.data.weather[0].main;
    console.log(response)
    console.log(weatherMain);
    backgroundImage(weatherMain, precipitations);
}

//Current place

function showPosition(){
    navigator.geolocation.getCurrentPosition(getDataPlace);
}

function searchPlaceForecast(latitude, longitude){
    let apiKey = 'b8460e3f37d976669c784023439cb3c3';
    let units = 'metric';
    let excludeInfo = 'current,minutely,hourly,alerts';
    let apiForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${excludeInfo}&appid=${apiKey}&units=${units}`
    axios.get(apiForecastURL).then(showForecastCoords);
}

function getDataPlace (coordenates){
    let latitude = coordenates.coords.latitude;
    let longitude = coordenates.coords.longitude;
    let apiKey = 'b8460e3f37d976669c784023439cb3c3';
    let units = 'metric';
    let excludeInfo = 'current,minutely,hourly,alerts';
    let apiURL = `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
    let apiForecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${excludeInfo}&appid=${apiKey}&units=${units}`
    
    axios.get(apiURL).then(showDataCoords);
    axios.get(apiForecastURL).then(showForecastCoords);
}

function showDataCoords(response){
    let icon = response.data.list[0].weather[0].icon;
    let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    let iconLabel = document.querySelector('#weather-img');
    iconLabel.setAttribute("src", iconURL);
    
    let city = response.data.list[0].name;
    let currentPlace = document.querySelector('#city-label');
    currentPlace.innerHTML = `${city}`;
    
    let temperature = Math.round(response.data.list[0].main.temp);
    let temperatureLabel = document.querySelector('#main-temperature');
    temperatureLabel.innerHTML = `${temperature}`;
    
    let weatherInfo = response.data.list[0].weather[0].description;
    let detailsLabel = document.querySelector('#weather-condition');
    detailsLabel.innerHTML = `${weatherInfo}`;
    
    let precipitations = response.data.list[0].clouds.all;
    let precipitationsLabel = document.querySelector('#precipitations-data');
    precipitationsLabel.innerHTML = `${precipitations}`;
    
    let humidity = Math.round(response.data.list[0].main.humidity);
    let humidityLabel = document.querySelector('#humidity-data');
    humidityLabel.innerHTML = `${humidity}`;
    
    let wind = Math.round(response.data.list[0].wind.speed);
    let windLabel = document.querySelector('#wind-data');
    windLabel.innerHTML = `${wind}`;
    
    let weatherMain = response.data.list[0].weather[0].main;
    console.log(weatherMain);
    backgroundImage(weatherMain, precipitations);
}

function showForecastCoords(response){
    let forecastDay = document.querySelector('#week-weather');
    forecastDay.innerHTML = '';
    for (let index = 1; index < 7; index++) {
        let day_info = response.data.daily[index];
        let dateTime = day_info.dt;
        let forecastIcon = day_info.weather[0].icon;
        let max_temperature = Math.round(day_info.temp.max);
        let min_temperature = Math.round(day_info.temp.min);
        let weekDay = getWeekDay(dateTime);
        forecastDay.innerHTML += `
            <div class="col text-center" id="day-weather">
                <p class="day-name">${weekDay}</p>
                <img src="" id="forecast-${index}"/>
                <p id="week-temperature"><strong><span class="celsius" id="max-temp">${max_temperature}</span>º</strong>  <span class="celsius" id="min-temp">${min_temperature}</span>º</p>      
            </div>`;
            
        let iconURL = `http://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
        let iconLabel = document.querySelector(`#forecast-${index}`);
        iconLabel.setAttribute("src", iconURL);  
    }
}

function getWeekDay(timestamp){
    let date = new Date(timestamp*1000);
    let day = date.getDay();
    let daysArray = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    let nameDay = daysArray[day];
    
    return nameDay;
}

function backgroundImage (weather, rain){
    let weatherImg = [{'name': 'Clear', 'url': 'img/pexels-skitterphoto-3768.jpg'}, 
                {'name': 'Few clouds', 'url': 'img/pexels-iconcom-479333.jpg'},
                {'name': 'Scattered clouds', 'url': 'img/pexels-neosiam-601798.jpg'},
                {'name': 'Rain', 'url': 'img/pexels-emiliano-arano-1298688.jpg'},
                {'name': 'Thunderstorm', 'url': 'img/pexels-rodrigo-souza-2531709.jpg'},
                {'name': 'Snow', 'url': 'img/pexels-pixabay-60561.jpg'},
                {'name': 'Mist', 'url': 'img/pexels-tyler-lastovich-441595.jpg'}];
    if (weather == 'Clouds' && rain <= 30){
        weather = 'Few clouds';
    }else if (weather == 'Clouds' && rain > 30){
        weather = 'Scattered clouds'
    }
    for (let i = 0; i <= weatherImg.length -1; i++) {
        if (weather == weatherImg[i].name){
            document.body.style.backgroundImage = "url("+weatherImg[i].url+")";
            document.body.style.backgroundSize = "cover";
        }
    }  
}

let findCity = document.querySelector("#search-city");
let currentButton = document.querySelector("#current-info");
let celsiusLink = document.querySelector("#temperature-celsius");
let farenheitLink = document.querySelector("#temperature-farenheit");

findCity.addEventListener("submit",  getDataTemp);
findCity.addEventListener("reset", navigator.geolocation.getCurrentPosition(getDataPlace));
currentButton.addEventListener("click", showPosition);
celsiusLink.addEventListener("click", changeTemperatureCelsius);
farenheitLink.addEventListener("click", changeTemperatureFarenheit);
