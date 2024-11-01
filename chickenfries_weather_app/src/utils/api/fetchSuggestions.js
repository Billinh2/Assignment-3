export const fetchSuggestions = async (userInput) => {
  try {
    const fetchFromAPI = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${process.env.WEATHER_API_KEY}&q=${userInput}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (!fetchFromAPI.ok) {
      throw new Error("Failed to fetch auto completion");
    }

    const result = await fetchFromAPI.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};