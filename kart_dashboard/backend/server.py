from fastapi import FastAPI, WebSocket
import asyncio
import time

app = FastAPI()

TRACK = [
    (-50, 0),
    (-30, 30),
    (0, 40),
    (30, 30),
    (50, 0),
    (30, -30),
    (0, -40),
    (-30, -30),
    (-50, 0)
]

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()

    i = 0

    while True:
        x, y = TRACK[i]

        data = {
            "timestamp": time.time(),
            "x": x,
            "y": y,
            "speed": 55,
            "rpm": 9000,
            "throttle": 70,
            "brake": 0
        }

        await ws.send_json(data)

        i = (i + 1) % len(TRACK)
        await asyncio.sleep(0.1)
