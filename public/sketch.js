const button = document.getElementById("checkin");
button.addEventListener("click", async () => {
  // Geolocate the client
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat, lon, weather_details, air;
      try {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        const api_url = `weather/${lat},${lon}`; //custom endpoint
        console.log(api_url);
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);

        weather_details = json.weather; // Get the weather description from the API endpoint
        air = json.air_quality.results[0].measurements[2];
        captureDetails = new Date().toLocaleString();
        console.log(captureDetails);

        const result_container = document.createElement("div");
        const result_text = document.createElement("p");
        
        result_text.textContent = `The weather in ${weather_details.name} (${lat.toFixed(2)}°,
        ${lon.toFixed(2)}°) is ${weather_details.weather[0].main} with a
        temperature of ${weather_details.main.temp}° C.

        The concentration of particulate matter (${air.parameter}) is ${air.value}${air.unit}, as
        measured by the ${air.sourceName}, last read on ${air.lastUpdated}.`;

        result_container.append(result_text);
        document.getElementById("result-container").append(result_container);
      } catch (error) {
        console.error(error);
        air = { value: -1 };
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
