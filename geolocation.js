export const geolocationCall = () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  return new Promise((resolve, reject) => {
    const success = (position) => {
      const coords = position.coords;

      console.log(`Latitude : ${coords.latitude}`);
      console.log(`Longitude: ${coords.longitude}`);
      console.log(`More or less ${coords.accuracy} meters.`);
      resolve(coords);
    };

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      reject(err);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  });
};
