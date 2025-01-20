const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('Mock WebSocket Server running on ws://localhost:8080');
});

// Simula mensagens enviadas para os clientes conectados
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Envia mensagens mock a cada 2 segundos
    setInterval(() => {
        const mockMessage = JSON.stringify({
            type: 'sensor-alert',
            sensor: 'Vazão', // Nome do sensor
            status: 'Crítico', // Status (mantido caso precise de múltiplos níveis)
            message: 'parou de funcionar!', // Mensagem adicional
        });
        ws.send(mockMessage);
    }, 2000);
    // Lida com mensagens recebidas do cliente (opcional)
    ws.on('message', (message) => {
        console.log('Mensagem recebida do cliente:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
