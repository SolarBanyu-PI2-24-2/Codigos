// Alertas criticos
const WS_URL = `ws://localhost:5000/ws/alerts/`;  

class AlertWebSocket {
    constructor() {
        this.connect();
    }

    connect() {
        this.socket = new WebSocket(WS_URL);
        this.socket.onopen = () => console.log('Conectado ao WebSocket');
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'alert') {  // Ajustado para match com o tipo que definimos no backend
                showAlert(data.message);
            }
        };

        this.socket.onerror = (error) => console.error('Erro no WebSocket:', error);
        
        this.socket.onclose = () => {
            console.log('Conexão WebSocket encerrada. Tentando reconectar...');
            setTimeout(() => this.connect(), 5000);  // Tenta reconectar a cada 5 segundos
        };
    }
}

function showAlert(message) {
    const audio = new Audio('/assets/alert-critical-sound.mp3');
    audio.play();

    const alertElement = document.createElement('div');
    alertElement.classList.add('alert-critical');
    alertElement.innerHTML = `
        <span class="close-alert">&times;</span>
        <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
        ${message}
    `;
    document.body.appendChild(alertElement);

    // Adiciona evento para fechar o alerta manualmente
    const closeButton = alertElement.querySelector('.close-alert');
    closeButton.addEventListener('click', () => {
        alertElement.remove();
        audio.pause();
        audio.currentTime = 0;
    });

    // Remove o alerta automaticamente após 10 segundos
    setTimeout(() => {
        alertElement.remove();
        audio.pause();
        audio.currentTime = 0;
    }, 10000);
}

// Inicializa o WebSocket
const alertWS = new AlertWebSocket();