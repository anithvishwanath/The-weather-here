const map = L.map("checkinMap").setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

getData();

async function getData() {
  const response = await fetch("/api");
  const data = await response.json();

  for (var item of data) {
      console.log(item.weather_details.name);
    const marker = L.marker([item.lat, item.lon]).addTo(map);
    let txt = `The weather here in ${item.weather_details.name} (${item.lat}&deg;,
    ${item.lon}&deg;) is ${item.weather_details.weather[0].main} with
    a temperature of ${item.weather_details.main.temp}&deg; C.`;

    if (item.air.value < 0) {
      txt += "  No air quality reading.";
    } else {
      txt += `  The concentration of particulate matter 
    (${item.air.parameter}) is ${item.air.value} 
    ${item.air.unit} last read on ${item.air.lastUpdated}`;
    }
    marker.bindPopup(txt);
  }
  console.log(data);
}
