export default async ({ query: { searchInput, geolocation } }, res) => {
  try {
    let coords;
    if (searchInput) {
      coords = await geocode(searchInput);
    } else if (geolocation) {
      const latLon = geolocation.split("|");
      coords = { latitude: latLon[0], longitude: latLon[1] };
    }
    const locationInformation = await reverseGeocode(
      `${coords.latitude},${coords.longitude}`
    );
    const response = await fetch(
      `https://weather-proxy.freecodecamp.rocks/api/current?lat=${coords.latitude}&lon=${coords.longitude}`
    );
    const responseJSON = await response.json();
    res.status(200).json({
      //freecode camp API:
      temperature: Math.floor(responseJSON.main.temp),
      feelsLikeTemp: Math.floor(responseJSON.main.feels_like),
      weatherIcon: responseJSON.weather[0].icon,
      weatherDescription: responseJSON.weather[0].main,
      //reverseGeocode:
      cityName: locationInformation.city,
      stateName: locationInformation.state,
    });
  } catch (error) {
    console.log(error);
    return {};
  }
};

const geocode = async (scanText) => {
  try {
    const response = await fetch(
      `https://geocode.xyz/?scantext=${encodeURIComponent(
        scanText
      )}&json=1&region=US`
    );
    const responseJSON = await response.json();
    const bestMatch =
      responseJSON.matches * 1 > 0 ? responseJSON.match[0] : responseJSON;
    return { latitude: bestMatch.latt, longitude: bestMatch.longt };
  } catch (error) {
    console.log(error);
  }
};

const reverseGeocode = async (coords) => {
  console.log("called");
  try {
    const response = await fetch(
      `https://geocode.xyz/?locate=${encodeURIComponent(coords)}&json=1`
    );

    const responseJSON = await response.json();

    return {
      city: responseJSON.city,
      state: responseJSON.state,
    };
  } catch (error) {
    console.log(error);
  }
};
