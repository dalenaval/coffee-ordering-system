from fastapi import HTTPException, Depends, APIRouter, WebSocket
from core.ws_manager import manager

router = APIRouter(prefix="/ws", tags=['Websocket'])

@router.ws("/payment/{order_id}")
async def payment_ws(ws:WebSocket, order_id: str):
    await manager.connect(order_id, ws)

    try:
        while True:
            await ws.receive_text()
    except:
        manager.disconnect(order_id, ws)
    
