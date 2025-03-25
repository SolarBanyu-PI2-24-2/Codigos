import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AlertConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("alerts", self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("alerts", self.channel_name)
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        await self.channel_layer.group_send(
            "alerts",
            {
                'type': 'alert_message',
                'message': message
            }
        )
    
    async def alert_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'alert_message',
            'message': message
        }))