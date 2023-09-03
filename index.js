const fetchDataBtn = document.getElementById("btn");

const api = "ade9fa65b0c92f65fc039a961119b8c7";

async function getData(lat, long) {
  const promise = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&exclude=current&appid=${api}`
  );
  return await promise.json();
}

async function gotLocation(position) {
  try {
    const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const weatherData = await getData(latitude, longitude);
  console.log(weatherData);
  detailData(weatherData);
  } catch (error) {
    console.log("An error occured", error);
  }
}

function failedLocation() {
  console.log("There was Some issue");
}

fetchDataBtn.addEventListener("click", async () => {
  navigator.geolocation.getCurrentPosition(gotLocation, failedLocation);
});

function degreesToDirection(degrees) {
  if (degrees >= 337.5 || degrees < 22.5) {
    return "North";
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return "North East";
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return "East";
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return "South East";
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return "South";
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return "South West";
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return "West";
  } else {
    return "North West";
  }
}

function offsetInSecondsTotimeZoneName(offsetInSeconds) {
  return (timeZoneName = `GMT ${offsetInSeconds >= 0 ? "+" : "-"}${Math.floor(
    Math.abs(offsetInSeconds / 3600)
  )}:${(Math.abs(offsetInSeconds) % 3600) / 60}`);
}

function detailData(weatherData) {
  const landingPage = document.getElementById("main");
  landingPage.innerHTML = "";

  const url = `https://maps.google.com/maps/?q=${weatherData.coord.lat},${weatherData.coord.lon}&output=embed`;

  const offsetInSeconds = weatherData.timezone;
  const timeZoneName = offsetInSecondsTotimeZoneName(offsetInSeconds);

  const deg = weatherData.wind.deg;
  const direction = degreesToDirection(deg);

  const InformationPage =
    document.getElementsByClassName("information-page")[0];

  InformationPage.innerHTML = `
  <div class="top">
          <h1>Welcome To The Weather App</h1>
          <p>Here is your current location</p>
          <div class="latlong">
            <p>Lat : <span class="lat">${weatherData.coord.lat}</span></p>
            <p>Long : <span class="long"> ${weatherData.coord.lon}</span></p>
          </div>
          <div class="map" id="map">
          <iframe
          src=${url}
          width="360"
          height="270"
          frameborder="0"
          style="border:0;width: 90vw;
          height: 65vh;margin-top:3rem; border-radius:1rem"></iframe>
          </div>
        </div>
  <div class="down">
          <div>
            <h2>Your Weather Data</h2>
          </div>
          <div class="data">
          <p>Location : ${weatherData.name}</p>
            <p>Wind Speed : ${weatherData.wind.speed} kmph</span></p>
            <p>Humidity : ${weatherData.main.humidity} %</p>
            <p>Time Zone : ${timeZoneName}</p>
            <p>Pressure : ${Math.round(weatherData.main.pressure)} hPa</p>
            <p>Wind Direction : ${direction}</p>
            <p>Temperature : ${Math.round(
              weatherData.main.temp - 273.15
            )} \u00B0C</p>
            <p>Feels like : ${Math.round(
              weatherData.main.feels_like - 273.15
            )} \u00B0C</p>
          </div>
        </div>
    `;
}

// bar / 1.01325
