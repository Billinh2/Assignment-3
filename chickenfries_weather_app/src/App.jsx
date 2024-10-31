import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./assets/Components/SearchBar";
import { CurrentWeather, findIcon } from "./assets/Components/CurrentWeather";
import TempChart from "./assets/Components/TempChart";
import Forecast from "./assets/Components/Forecast";
import Footer from "./assets/Components/Footer";
import weatherData from "./assets/weatherData.json";  // Import JSON data
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cloudImg from "./assets/cloud.jpg";
import nightImg from "./assets/night.jpg";

function App() {
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [toggle, setToggle] = useState(true);

  // Effect change background after toggling
  useEffect(() => {
   document.body.style = `background-image:  linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${toggle ? cloudImg : nightImg});`
  }, [toggle]);

  // Double checked if it's night or day
  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >=6 && hour < 18; 
    setToggle(isDay);
  }, []);


  useEffect(() => {
    // Simulate setting weather data from JSON based on location
    const data = weatherData.find(item => item.location === location || item.lat === lat && item.lon === lon);
    if (data) {
      setWeather(data);
    }
  }, [location, lat, lon]);

  // Store the current weather data in an object
  const currentData = {
    temp: weather?.current?.temp_c,
    location: weather?.location?.name,
    date: weather?.location?.localtime,
    icon: weather?.current?.condition?.icon,
    text: weather?.current?.condition?.text,
  };

  
  const extraData = {
    pressure: weather?.current?.pressure_mb,
    wind: weather?.current?.wind_mph,
  };

  
  const forecastDays = weather?.forecast?.forecastday;

  
  const temps = [];
  weather?.forecast?.forecastday[0].hour.forEach((hour) => {
    temps.push(hour.temp_c);
  });

  // Filter the hourly temperature data to get the temperature every 3 hours
  const eightTemps = temps.filter((_, i) => i % 3 === 0);

  // Add the last temperature to the array
  const nineTemps = [...eightTemps, temps[temps.length - 1]];

  // Convert the date to words
  const dateToWords = (date) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    date = new Date(date);
    const month = months[date.getMonth()];
    const dateNum = date.getDate();

    return `${month} ${dateNum}`;
  };

  return (
    <div className="App">
      <nav className="nav">
        <div className="logo">
          <FontAwesomeIcon
            icon="fa-brands fa-skyatlas"
            className="logo__icon"
          />
          <h1 className="logo__text">skyWatch</h1>
        </div>
        <SearchBar setCity={setLocation} toggle={toggle} />
        <FontAwesomeIcon
          icon="fa-solid fa-circle-half-stroke"
          className="switch-mode"
          onClick={() => {
            setToggle(!toggle);
          }}
          style={{
            transform: toggle ? "scaleX(1)" : "scaleX(-1)",
          }}
        />
      </nav>
      <div className="grid-two">
        <div className="grid-one">
          <CurrentWeather weatherData={currentData} />
          <div className="grid-three">
            {forecastDays?.map((day) => {
              return (
                <Forecast
                  key={day.date}
                  date={dateToWords(day.date)}
                  icon={findIcon(day.day?.condition?.text)}
                  value={day.day?.avghumidity}
                />
              );
            })}
          </div>
          <div className="grid-three">
            <ExtraData extraData={extraData} />
          </div>
        </div>
        <div className="grid-four">
          <TempChart tempsData={nineTemps} />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
