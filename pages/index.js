import Head from "next/head";
import WeatherIcon from "../components/WeatherIcon";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { geolocationCall } from "../geolocation";
import cities from "../cities.json";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [geolocation, setGeolocation] = useState();
  const [isFahrenheit, setFahrenheit] = useState(true);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(() => {
    if (searchTerm) {
      return `/api/weather?searchInput=${encodeURIComponent(searchTerm)}`;
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

  const handleSubmit = (e) => {
    setSearchTerm(searchInput);
  };

  const handleClear = (e) => {
    setSearchTerm("");
    setSearchInput("");
  };

  const handleChangeTempMeasurement = () => {
    setFahrenheit(!isFahrenheit);
  };

  const celsiusToFahrenheit = (temp) => {
    return temp * 2 + 30;
  };

  const handleLocationChange = async () => {
    setSearchTerm("");
  };

  const displayTemperature = (data, extractFunc) => {
    if (!data) {
      return "...";
    } else if (isFahrenheit) {
      return `${celsiusToFahrenheit(extractFunc(data))}\u00b0F`;
    } else {
      return `${extractFunc(data)}\u00b0C`;
    }
  };

  const displayLocationData = (data) => {
    if (!data) {
      return "...";
    } else if (!data.cityName) {
      return data.stationName;
    } else if (!data.stateName) {
      return data.cityName;
    } else {
      return `${data.cityName}, ${data.stateName}`;
    }
  };

  const displayWeatherDescription = (data) => {
    if (!data) {
      return "...";
    } else if (!data.weatherDescription) {
      return null;
    } else {
      return data.weatherDescription;
    }
  };

  const displayWeatherIcon = (data) => {
    if (!data || !data.weatherDescription) {
      return ["/not_applicable.svg", "N/A"];
    }
    const descriptionLowerCase = data.weatherDescription.toLowerCase();
    let date = new Date();
    const isDaytime = date.getHours() >= 5 && date.getHours() <= 18;

    if (descriptionLowerCase.includes("cloud") && isDaytime) {
      return ["/weather_icons/animated/cloudy-day.svg", "cloudy day"];
    } else if (descriptionLowerCase.includes("cloud") && !isDaytime) {
      return ["/weather_icons/animated/cloudy-night.svg", "cloudy night"];
    } else if (
      (descriptionLowerCase.includes("clear") ||
        descriptionLowerCase.includes("sun")) &&
      isDaytime
    ) {
      return ["/weather_icons/animated/day.svg", "sun"];
    } else if (descriptionLowerCase.includes("clear") && !isDaytime) {
      return ["/weather_icons/animated/night.svg", "moon"];
    } else if (descriptionLowerCase.includes("snow")) {
      return ["/weather_icons/animated/snowy.svg", "snowy"];
    } else if (descriptionLowerCase.includes("rain")) {
      return ["/weather_icons/animated/rainy.svg", "rain"];
    } else {
      return ["/not_applicable.svg", "N/A"];
    }
  };

  return (
    <>
      <Head>
        <title>Weather</title>
        <link
          rel="stylesheet"
          href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
          integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
          crossorigin="anonymous"
        />
      </Head>
      <main
        className="container"
        style={{
          "padding-top": "15em;",
          "min-height": "100vh;",
        }}
      >
        <div className="row">
          <div className="col text-center">
            <div className="position-absolute">
              <button
                onClick={handleChangeTempMeasurement}
                className="left-buttons btn btn-lg text-white"
                style={{ "border-radius": "50%;" }}
              >
                <strong>&deg;{isFahrenheit ? "C" : "F"}</strong>
              </button>
              <div className="mt-3">
                <button
                  onClick={handleLocationChange}
                  className="left-buttons btn btn-lg text-white"
                  style={{ "border-radius": "50%;" }}
                >
                  <i class="fas fa-location-arrow"></i>
                </button>
              </div>
            </div>
            <h1 className="mb-4">Weather in {displayLocationData(data)}</h1>
            <div id="temperature">
              {displayTemperature(data, (d) => d.temperature)}
            </div>

            <WeatherIcon src={displayWeatherIcon(data)} />

            <div className="weather-description mb-2">
              {displayWeatherDescription(data)}
            </div>

            <div className="mb-4 weather-description">
              Feels Like: {displayTemperature(data, (d) => d.feelsLikeTemp)}
            </div>
          </div>
        </div>
        <div className="row g-3 d-flex justify-content-center">
          <label htmlFor="location-input" className="col-auto col-form-label">
            <strong>Search Another Location</strong>
          </label>
          <div className="col-auto">
            <input
              className="form-control"
              id="location-input"
              type="text"
              list="cities-list"
              value={searchInput}
              onChange={handleCityInputChange}
              placeholder="Type to search..."
            />
            <datalist id="cities-list">
              {cities.map((entry) => (
                <option value={`${entry.city}, ${entry.state}`} />
              ))}
            </datalist>
          </div>
          <div className="col-auto">
            <span className="me-2">
              <button
                onClick={handleSubmit}
                className="btn btn-primary mb-3 search-buttons"
              >
                Search
              </button>
            </span>
            <button
              onClick={handleClear}
              className="btn btn-primary mb-3 search-buttons"
            >
              Clear
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
