const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas al navegador
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Estado local del cliente
let connected = false;
let gameState = null;
let myId = null;

// Controles del jugador
const keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

// Escuchar teclado
window.addEventListener('keydown', (e) => handleKey(e.code, true));
window.addEventListener('keyup', (e) => handleKey(e.code, false));

function handleKey(code, isPressed) {
  let changed = false;
  if (code === 'KeyW' || code === 'ArrowUp') { keys.up = isPressed; changed = true; }
  if (code === 'KeyS' || code === 'ArrowDown') { keys.down = isPressed; changed = true; }
  if (code === 'KeyA' || code === 'ArrowLeft') { keys.left = isPressed; changed = true; }
  if (code === 'KeyD' || code === 'ArrowRight') { keys.right = isPressed; changed = true; }

  if (changed && connected) {
    socket.emit('input', keys);
  }
}

// Socket events
socket.on('connect', () => {
  connected = true;
  myId = socket.id;
  console.log('Conectado al servidor:', myId);
});

socket.on('disconnect', () => {
  connected = false;
  console.log('Desconectado del servidor');
});

socket.on('game_update', (state) => {
  gameState = state;
});

// Bucle principal de dibujo
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Dibujar Fondo de Nieve
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!connected) {
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Conectando al servidor...', canvas.width / 2, canvas.height / 2);
    requestAnimationFrame(render);
    return;
  }

  // 2. Si hay estado de juego del servidor, renderizar los jugadores
  if (gameState && gameState.players) {
    Object.values(gameState.players).forEach(player => {
      // Color según equipo (Conejos = Azul, Venados = Rojo)
      ctx.fillStyle = player.team === 'conejos' ? '#3b82f6' : '#ef4444';
      
      // Dibujar personaje (Círculo)
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius || 20, 0, Math.PI * 2);
      ctx.fill();

      // Borde para tu propio personaje
      if (player.id === myId) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Nombre del jugador
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(player.nickname || 'Jugador', player.x, player.y - 25);
    });

    // Dibujar Bandera si existe en el estado
    if (gameState.flag) {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(gameState.flag.x, gameState.flag.y, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Interfaz inicial para unirse / crear sala
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Conejos vs Venados', canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Usa WASD o Flechas para moverte', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText('Presiona [ESPACIO] para ingresar a una sala', canvas.width / 2, canvas.height / 2 + 30);
  }

  requestAnimationFrame(render);
}

// Iniciar evento de prueba con tecla Espacio
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && connected && !gameState) {
    const nickname = prompt('Ingresa tu apodo:', 'Jugador1') || 'Jugador';
    socket.emit('create_room', { mode: 'classic', nickname });
  }
});

render();
