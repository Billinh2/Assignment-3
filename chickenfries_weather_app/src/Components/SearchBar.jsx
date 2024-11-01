import { useState, useEffect } from "react";
import {useDebounce} from "@uidotdev/usehooks"; // Import the useDebounce hook
import "./SearchBar.css";

const SearchBar = ({ setCity, toggle }) => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use debounced location value
  const debouncedLocation = useDebounce(location, 500); // 500ms delay

  const fetchSuggestions = async (userInput) => {
    setIsLoading(true);
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
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const userInput = e.target.value;
    setLocation(userInput);
  };

  // Trigger fetchSuggestions only when debouncedLocation changes
  useEffect(() => {
    if (debouncedLocation.length > 0) {
      fetchSuggestions(debouncedLocation);
    } else {
      setSuggestions([]);
    }
  }, [debouncedLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(location);
    setSuggestions([]); // Clear suggestions on submit
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion?.name);
    setCity(suggestion?.name);
    setSuggestions([]); // Clear suggestions on selection
  };

  return (
    <div className="search-bar">
      <div className="omrs-input-group">
        <form onSubmit={handleSubmit}>
          <label className="omrs-input-underlined">
            <input
              type="text"
              name="Location"
              value={location}
              required
              onChange={handleChange}
              style={{
                background: toggle
                  ? "rgba(73, 133, 224, 0.3)"
                  : "rgba(17, 51, 101, 0.425)",
              }}
              autoComplete="off"
            />
            <span className="omrs-input-label">Type your location...</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 384 512"
            >
              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z" />
            </svg>
          </label>

          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion && suggestion.name}
                  </li>
                ))}
              </ul>
            )
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
