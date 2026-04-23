from fastapi import WebSocket
from typing import Dict
import json

class ConnectionManager:
    def __init__(self):
        # Store connections keyed by user_id or order_id
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, order_id: int):
        await websocket.accept()
        self.active_connections[order_id] = websocket

    def disconnect(self, order_id: int):
        if order_id in self.active_connections:
            del self.active_connections[order_id]

    async def send_payment_update(self, order_id: int, data: dict):
        if order_id in self.active_connections:
            await self.active_connections[order_id].send_json(data)

manager = ConnectionManager()