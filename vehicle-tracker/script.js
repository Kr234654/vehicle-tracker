
let map = L.map('map').setView([17.385044, 78.486671], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let route = [];
let polyline;
let marker;
let index = 0;
let intervalId;
let isPlaying = false;

async function loadRoute() {
  const res = await fetch("dummy-route.json");
  route = await res.json();
  drawRoutePath();
  setupMarker();
}

function drawRoutePath() {
  const latlngs = route.map(p => [p.latitude, p.longitude]);
  polyline = L.polyline(latlngs.slice(0, 1), { color: 'blue' }).addTo(map);
}

function setupMarker() {
  const firstPoint = route[0];
  marker = L.marker([firstPoint.latitude, firstPoint.longitude]).addTo(map);
  updateInfo(firstPoint);
}

function updateInfo(point) {
  document.getElementById('info').innerHTML = `
    <strong>Latitude:</strong> ${point.latitude.toFixed(6)}<br>
    <strong>Longitude:</strong> ${point.longitude.toFixed(6)}<br>
    <strong>Time:</strong> ${new Date(point.timestamp).toLocaleTimeString()}
  `;
}

function moveVehicle() {
  if (index >= route.length) {
    clearInterval(intervalId);
    return;
  }
  const point = route[index];
  marker.setLatLng([point.latitude, point.longitude]);
  polyline.addLatLng([point.latitude, point.longitude]);
  updateInfo(point);
  index++;
}

document.getElementById("playBtn").addEventListener("click", () => {
  if (!isPlaying) {
    isPlaying = true;
    intervalId = setInterval(moveVehicle, 1000);
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  isPlaying = false;
  clearInterval(intervalId);
});

loadRoute();
