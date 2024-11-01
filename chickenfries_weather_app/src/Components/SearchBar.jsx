import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@uidotdev/usehooks"; // Import the useDebounce hook
import { useMutation } from "@tanstack/react-query";
import { fetchSuggestions } from "../utils/api/fetchSuggestions";
import "./SearchBar.css";

const SearchBar = ({ setCity, toggle }) => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedLocation = useDebounce(location, 500); // 500ms delay

  // Define the mutation for fetching suggestions
  const { mutate: getSuggestions, isLoading, isError } = useMutation(
    fetchSuggestions,
    {
      onSuccess: (data) => {
        setSuggestions(data);
      },
      onError: () => {
        setSuggestions([]); // Clear suggestions if there's an error
      },
      cacheTime: 30
    }
  );

  // Trigger fetchSuggestions only when debouncedLocation changes
  useEffect(() => {
    if (debouncedLocation.length > 0) {
      getSuggestions(debouncedLocation); // Call mutation with debounced input
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  }, [debouncedLocation, getSuggestions]);

  // Handle input change
  const handleChange = useCallback((e) => {
    setLocation(e.target.value);
  }, [location, setLocation]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setCity(location);
    setSuggestions([]); // Clear suggestions on submit
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion) => {
    setLocation(suggestion?.name);
    setCity(suggestion?.name);
    setSuggestions([]); // Clear suggestions on selection
  }, []);

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

          {/* Display suggestions, loading spinner, or error message */}
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : isError ? (
            <div className="error-message">Failed to load suggestions</div>
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
