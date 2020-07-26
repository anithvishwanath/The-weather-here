const button = document.getElementById("checkin");
button.addEventListener("click", async () => {
  // Geolocate the client
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat, lon, weather_details, air;
      try {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        //console.log(latTemp);
        document.getElementById("lat").textContent = lat.toFixed(2);
        document.getElementById("lon").textContent = lon.toFixed(2);

        const api_url = `weather/${lat},${lon}`; //custom endpoint
        console.log(api_url);
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);

        weather_details = json.weather; // Get the weather description from the API endpoint
        air = json.air_quality.results[0].measurements[2];
        captureDetails = new Date().toLocaleString();
        console.log(captureDetails);

        document.getElementById("city").textContent = weather_details.name;
        document.getElementById("description").textContent =
          weather_details.weather[0].main;
        document.getElementById("temp").textContent = weather_details.main.temp;

        document.getElementById("aq_parameter").textContent = air.parameter;
        document.getElementById("aq_source").textContent = air.sourceName;
        document.getElementById("aq_value").textContent = air.value;
        document.getElementById("aq_units").textContent = air.unit;
        document.getElementById("aq_date").textContent = air.lastUpdated;
      } catch (error) {
        console.error(error);
        air = { value: -1 };
        document.getElementById("temp").textContent = "NO READING";
      }

      /* Save it to the DB */
      const data = { lat, lon, weather_details, air };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const db_response = await fetch("/api", options);
      const db_json = await db_response.json();
    });
  } else {
    console.log("geolocation not available");
  }
});
