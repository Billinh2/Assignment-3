import { useState, useEffect } from "react";
import SearchBar from "../Components/SearchBar";
import { CurrentWeather, findIcon } from "../Components/CurrentWeather";
import TempChart from "../Components/TempChart";
import HumidityChart from "../Components/HumidityChart";
import RainfallChart from "../Components/RainFallChart";
import Forecast from "../Components/Forecast";
import Footer from "../Components/Footer";
import ExtraData from "../Components/ExtraData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import cloudImg from "../assets/cloud.jpg";
import nightImg from "../assets/night.jpg";
import { fetchWeatherByLocation } from "../utils/api/fetchWeatherByLocation";

function MainPage() {
  const [location, setLocation] = useState("");
  const [isQueryEnabled, setIsQueryEnabled] = useState(false); // New state to control query execution
  const [toggle, setToggle] = useState(true);
  const apiKey = process.env.WEATHER_API_KEY;

  // Set day or night based on current hour
  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    setToggle(isDay);
  }, []);

  // Update background image on toggle change
  useEffect(() => {
    document.body.style = `background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${
      toggle ? cloudImg : nightImg
    });`;
  }, [toggle]);

  // Enable query only when location is set
  useEffect(() => {
    setIsQueryEnabled(location !== "");
  }, [location]);

  // Fetch weather data by location name from SearchBar
  const { data: weatherByLocation, isLoading: isLoadingLocation, isError: isErrorLocation } = useQuery(
    ["weatherByLocation", location],
    () => fetchWeatherByLocation(apiKey, location),
    {
      enabled: isQueryEnabled, // Only run this query if isQueryEnabled is true
      cacheTime: 30
    },
  );

  // Determine which weather data to display
  const weather = weatherByLocation;

  // Current weather data
  const currentData = {
    temp: weather?.current?.temp_c,
    location: weather?.location?.name,
    date: weather?.location?.localtime,
    icon: weather?.current?.condition?.icon,
    text: weather?.current?.condition?.text,
  };

  // Additional weather data
  const extraData = {
    pressure: weather?.current?.pressure_mb,
    wind: weather?.current?.wind_mph,
  };

  // Forecast data
  const forecastDays = weather?.forecast?.forecastday;

  // Hourly temperature data
  const temps = [];
  weather?.forecast?.forecastday[0].hour.forEach((hour) => temps.push(hour.temp_c));

  // Filter for every 3-hour temperature and add the last temperature
  const eightTemps = temps.filter((_, i) => i % 3 === 0);
  const nineTemps = [...eightTemps, temps[temps.length - 1]];

  // Humidity data for pie chart
  const humidityData = forecastDays?.map(day => day.day?.avghumidity);

  // Rainfall data for bar chart
  const rainfallData = forecastDays?.map(day => day.day?.totalprecip_mm);

  // Convert date to a more readable format
  const dateToWords = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    date = new Date(date);
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="App">
      <nav className="nav">
        <div className="logo">
          <FontAwesomeIcon icon="fa-brands fa-skyatlas" className="logo__icon" />
          <h1 className="logo__text">ChickenFries</h1>
        </div>
        <SearchBar setCity={setLocation} toggle={toggle} />
        <FontAwesomeIcon
          icon="fa-solid fa-circle-half-stroke"
          className="switch-mode"
          onClick={() => setToggle(!toggle)}
          style={{ transform: toggle ? "scaleX(1)" : "scaleX(-1)" }}
        />
      </nav>

      {/* Display loading spinner only when query is enabled and loading */}
      {isQueryEnabled && isLoadingLocation && <div className="main-page-loading-spinner"></div>}
      {isErrorLocation && <div className="main-page-error">Error fetching weather data</div>}

      {!isQueryEnabled || !isLoadingLocation && (
        <div className="grid-two">
          <div className="grid-one">
            <CurrentWeather weatherData={currentData} />
            <div className="grid-three">
              {forecastDays?.map((day) => (
                <Forecast
                  key={day.date}
                  date={dateToWords(day.date)}
                  icon={findIcon(day.day?.condition?.text)}
                  value={day.day?.avghumidity}
                />
              ))}
            </div>
            <div className="grid-three">
              <ExtraData extraData={extraData} />
            </div>
            <RainfallChart rainfallData={rainfallData} /> 
          </div>
          <div className="grid-four">
            <TempChart tempsData={nineTemps} />
            <HumidityChart humidityData={humidityData} />
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
