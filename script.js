let map = L.map('map').setView([17.385044, 78.486671], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let route = [
  { "latitude": 17.385044, "longitude": 78.486671, "timestamp": "2024-07-20T10:00:00Z" },
  { "latitude": 17.385045, "longitude": 78.486672, "timestamp": "2024-07-20T10:00:05Z" },
  { "latitude": 17.385050, "longitude": 78.486680, "timestamp": "2024-07-20T10:00:10Z" },
  { "latitude": 17.385060, "longitude": 78.486690, "timestamp": "2024-07-20T10:00:15Z" },
  { "latitude": 17.385070, "longitude": 78.486700, "timestamp": "2024-07-20T10:00:20Z" }
];

let polyline;
let marker;
let index = 0;
let intervalId;
let isPlaying = false;

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

drawRoutePath();
setupMarker();
