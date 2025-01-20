// Alertas criticos
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => console.log('Conectado ao WebSocket');
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'sensor-alert') {
        showAlert(`Alerta crítico: Sensor de ${data.sensor} parou de funcionar`);
    }
};

socket.onerror = (error) => console.error('Erro no WebSocket:', error);
socket.onclose = () => console.log('Conexão WebSocket encerrada');

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
        alertElement.remove(); // Remove o alerta
        audio.pause(); // Para o som
        audio.currentTime = 0; // Reinicia o som para o início
    });

    // Remove o alerta automaticamente após 10 segundos
    setTimeout(() => {
        alertElement.remove();
        audio.pause(); // Para o som
        audio.currentTime = 0; // Reinicia o som para o início
    }, 10000);
}