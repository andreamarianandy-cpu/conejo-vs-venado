const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let conectado = false;

socket.on('connect', () => {
  console.log('¡Conectado al servidor de Render!', socket.id);
  conectado = true;
});

socket.on('disconnect', () => {
  conectado = false;
});

// Bucle principal de renderizado
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fondo nevado
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!conectado) {
    ctx.fillStyle = '#0f172a';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Conectando al servidor...', canvas.width / 2, canvas.height / 2);
  } else {
    // Aquí puedes empezar a dibujar tu juego, avatares o interfaz de salas
    ctx.fillStyle = '#0f172a';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Conejos vs Venados', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('¡Conexión establecida! Diseña tu menú o lógica de juego aquí.', canvas.width / 2, canvas.height / 2 + 10);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
