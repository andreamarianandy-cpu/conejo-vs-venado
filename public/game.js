const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Bucle básico de renderizado de prueba cliente
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar fondo nevado básico
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texto de carga / menú preliminar en Canvas
  ctx.fillStyle = '#0f172a';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Conejos vs Venados - Conectando al servidor...', canvas.width / 2, canvas.height / 2);

  requestAnimationFrame(gameLoop);
}

gameLoop();
