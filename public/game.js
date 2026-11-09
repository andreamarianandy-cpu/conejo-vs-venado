const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Variable para controlar el estado de conexión
let conectado = false;

socket.on('connect', () => {
  console.log('¡Conectado con éxito al servidor!', socket.id);
  conectado = true;
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor.');
  conectado = false;
});

// Bucle principal del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar fondo nevado básico
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';

  if (!conectado) {
    // Si aún se está conectando
    ctx.fillText('Conejos vs Venados - Conectando al servidor...', canvas.width / 2, canvas.height / 2);
  } else {
    // Una vez conectado con éxito
    ctx.fillText('¡Conectado! Listo para jugar (Sala / Menú)', canvas.width / 2, canvas.height / 2);
    // Aquí más adelante puedes pintar a tus conejos, venados y elementos del juego
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
