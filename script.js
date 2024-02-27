//left side open variables//

const conditionTextBox = document.querySelector(".conditionText");
const placeNameBox = document.querySelector(".placeName");
const dateBox = document.querySelector(".date");
const timeBox = document.querySelector(".time");
const tempratureBox = document.querySelector(".temprature");
const discriptionIconBox = document.querySelector(".discriptionIcon");

const errorBox = document.querySelector(".errorBox");
const CtoF = document.querySelector(".CtoF");
const FtoC = document.querySelector(".FtoC")
const searchButton = document.querySelector(".searchicon")

let x = true;
let hour =0
// right side varibles //

const feelsLikeTempBox = document.querySelector(".feelsLikeTemp");
const humidityBox = document.querySelector(".humidity");
const windSpeedBox = document.querySelector(".windSpeed");

//////forecast open variables//////
const forecast = document.querySelector(".forecast");
const nextButton = document.querySelector(".nextButton");

// current data//

async function fetchCurrentData(searchText){
  
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=b6b6b701e9f54196928162821242502&q=${searchText}`, { mode: "cors"});
  
  const weatherData = await response.json();

  console.log("current", weatherData);
  const conditionText = weatherData.current.condition.text;
  const conditionIcon = weatherData.current.condition.icon;

  const humidity = weatherData.current.humidity;

  const tempC = weatherData.current.temp_c;
  const tempF = weatherData.current.temp_f;

  const windSpeed = weatherData.current.wind_kph;

  const placeName = weatherData.location.name;

  const dateTime = weatherData.location.localtime;
  const dateTimeArray = dateTime.split(" ");
  
  const date = dateTimeArray[0];
  const time = dateTimeArray[1];

  const iconUrl = weatherData.current.condition.icon;


  displayCondition(conditionText)
  displayPlace(placeName)
  displayDate(date)
  displayTime(time)
  displayTempratureC(tempC)
  displayIcon(iconUrl)
  displayHumidity(humidity)
  displayWindSpeed(windSpeed)

  CtoF.addEventListener("click", () =>{
    changeUnit(tempC, tempF);
  }) 
  errorBox.textContent = ""

}
fetchCurrentData("gwalior")
fetchForecastData("gwalior")


searchButton.addEventListener("click", ()=>{
  console.log(hour)
  const searchText =  document.querySelector("#search").value;
  fetchCurrentData(searchText).catch((error)=>{
    console.log(error);
    errorBox.textContent = " Please enter a valid City or a Country"
  })
  fetchForecastData(searchText).catch((error)=>{
    console.log(error);
    errorBox.textContent = " Please enter a valid City or a Country"
  })

}) 

 

function displayCondition(conditionText){
  conditionTextBox.textContent = conditionText;
}
function displayPlace(place){
  placeNameBox.textContent = place;
}
function displayDate(date){
  dateBox.textContent = date;
}
function displayTime(time){
  timeBox.textContent = time;
}
function displayTempratureC(temprature){
  tempratureBox.textContent = temprature+" °C";
  feelsLikeTempBox.textContent = temprature+" °C";
}
function displayTempratureF(temprature){
  tempratureBox.textContent = temprature+" °F";
  feelsLikeTempBox.textContent = temprature+" °F";
}
function displayIcon(iconUrl){
    discriptionIconBox.src = iconUrl
}
function changeUnit(tempC, tempF){
  if(x){
    displayTempratureF(tempF);
    CtoF.textContent = "Display °C"
    x = false;
  }else{
    displayTempratureC(tempC);
    CtoF.textContent = "Display °F"
    x = true;

  }
  
}
function displayHumidity(humidity){
  humidityBox.textContent = humidity+" %";
}
function displayWindSpeed(windSpeed){
  windSpeedBox.textContent = windSpeed+" km/h";
}


//////////////////////////////////////////////////


//////////////////////////////////////////////////

async function fetchForecastData(searchText){
  hour = 0;
  forecast.innerHTML = "";
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b6b6b701e9f54196928162821242502&q=${searchText}`, {mode:"cors"});

  const forecastData = await response.json();
  console.log("forecast", forecastData);

  function getForecastHourData(hour){
    const forHourTempC = forecastData.forecast.forecastday[0].hour[hour].temp_c;
    const forHourTempF = forecastData.forecast.forecastday[0].hour[hour].temp_f;
    const forTimeArray = forecastData.forecast.forecastday[0].hour[hour].time.split(" ");
    const forHour = forTimeArray[1];
    const forHourIcon = forecastData.forecast.forecastday[0].hour[hour].condition.icon;

    return{forHourTempC, forHourTempF, forHour, forHourIcon}
  }
  
  function displayForData(k){
    for(hour; hour<=k; hour++){
      const currentForData = getForecastHourData(hour);
      makeHourBox(currentForData);
      console.log(hour)
      
    }
  }
  displayForData(5)
  
}

function makeHourBox(currentForData){
  const hourBox = document.createElement("div");
  hourBox.classList.add("hourBox")
  const forecastHour = document.createElement("div");
  const forecastTemp = document.createElement("div");
  const forecastIcon = document.createElement("img");
  const forecastIconBox = document.createElement("div")
  forecastHour.classList.add("forecasthour");
  forecastTemp.classList.add("forecasttemp");
  forecastIconBox.classList.add("forecastIconBox")
  forecastIcon.classList.add("forecastIcon")
  forecastIconBox.appendChild(forecastIcon);
  hourBox.appendChild(forecastHour);
  hourBox.appendChild(forecastTemp);
  hourBox.appendChild(forecastIconBox);
  forecast.appendChild(hourBox);

  forecastHour.textContent = currentForData.forHour;
  forecastIcon.src = currentForData.forHourIcon;
  forecastTemp.textContent = currentForData.forHourTempC+" °C";
}