let referenceTrack = [];

fetch("track.json")
  .then(res => res.json())
  .then(data => {
    referenceTrack = data;
  });

const ws = new WebSocket("ws://localhost:8000/ws");

const speedEl = document.getElementById("speed");
const rpmEl = document.getElementById("rpm");
const throttleEl = document.getElementById("throttle");
const brakeEl = document.getElementById("brake");

const canvas = document.getElementById("trackCanvas");
const ctx = canvas.getContext("2d");

let path = [];

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    speedEl.innerText = data.speed.toFixed(0) + " km/h";
    rpmEl.innerText = Math.round(data.rpm);
    throttleEl.innerText = data.throttle.toFixed(0) + " %";
    brakeEl.innerText = data.brake.toFixed(0) + " %";

    drawTrack(data.x, data.y);
};

function drawTrack(x, y) {
    const scale = 3;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    const cx = offsetX + x * scale;
    const cy = offsetY + y * scale;

    path.push({ x: cx, y: cy });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1️⃣ Draw reference track (static)
    if (referenceTrack.length > 0) {
        ctx.strokeStyle = "#0066ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        referenceTrack.forEach((p, i) => {
            const tx = offsetX + p.x * scale;
            const ty = offsetY + p.y * scale;
            if (i === 0) ctx.moveTo(tx, ty);
            else ctx.lineTo(tx, ty);
        });
        ctx.stroke();
    }

    // 2️⃣ Draw current lap (dotted)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#00ff99";
    ctx.lineWidth = 1;
    ctx.beginPath();
    path.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // 3️⃣ Draw kart dot
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
}

