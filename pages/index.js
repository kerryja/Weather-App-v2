import Head from "next/head";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { geolocationCall } from "../geolocation";
import cities from "../cities.json";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [geolocation, setGeolocation] = useState();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(() => {
    if (searchInput) {
      return `/api/weather?searchInput=${encodeURIComponent(searchInput)}`;
    } else if (geolocation) {
      return `/api/weather?geolocation=${geolocation.latitude}|${geolocation.longitude}`;
    }
    return null;
  }, fetcher);

  useEffect(async () => {
    setGeolocation(await geolocationCall());
  }, []);

  const handleCityInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const celsiusToFahrenheit = (temp) => {
    return temp * 2 + 30;
  };

  return (
    <div>
      <p>{!data ? "loading" : `${data.cityName}, ${data.stateName}`}</p>
      <p>{!data ? "loading" : celsiusToFahrenheit(data.temperature)}</p>
      <div>
        <form>
          <label htmlFor="location-input" className="form-label">
            Search Another Location
          </label>
          <input
            className="form-control"
            id="location-input"
            type="text"
            list="cities-list"
            value={searchInput}
            onChange={handleCityInputChange}
            placeholder="Type to search..."
          />
          <datalist id="cities-list" className="dropdown-menu">
            {cities.map((entry) => (
              <option value={`${entry.city}, ${entry.state}`} />
            ))}
          </datalist>
        </form>
      </div>
    </div>
  );
}
