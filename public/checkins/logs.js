const map = L.map("checkinMap", {
  preferCanvas: true,
}).setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

getData();

async function getData() {
  try {
    const response = await fetch("/api");
    const data = await response.json();
    console.log(data);

    for (var item of data) {
      const marker = L.marker([item.lat, item.lon], { riseOnHover: true }).addTo(map);

      let dateStringOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "long",
      };

      let dateString = new Date(item.air.lastUpdated).toLocaleString(
        undefined,
        dateStringOptions
      );

      let capture_time = new Date(item.timestamp).toLocaleString(
        undefined,
        dateStringOptions
      );

      let txt = `The weather here in ${
        item.weather_details.name
      } (${item.lat.toFixed(2)}&deg;,
    ${item.lon.toFixed(2)}&deg;) is ${item.weather_details.weather[0].main} with
    a temperature of ${item.weather_details.main.temp}&deg; C.`;
      if (item.air.value < 0) {
        txt += "\nNo air quality reading.";
      } else {
        txt += `<br /><br />The concentration of particulate matter 
    (${item.air.parameter}) in the air is <strong>${item.air.value} 
    ${item.air.unit}</strong>, last measured on ${dateString}.

    <br /><br /><strong>Check in date: ${capture_time}</strong>`;
      }
      marker.bindPopup(txt);
    }
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
