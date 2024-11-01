// Fetch weather data by location name from SearchBar
export const fetchWeatherByLocation = async (apiKey, location) => {
    try {
        const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=yes`
        );
        if (!response.ok) throw new Error("Failed to retrieve weather data");
        return response.json();
    } catch(err) {
        console.error(err);
        throw err;
    }
};
  