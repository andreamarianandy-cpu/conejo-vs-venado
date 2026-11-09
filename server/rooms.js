class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  handleCreate(socket, mode, nickname, ip) {
    const code = this.generateCode();
    const room = {
      code,
      mode,
      players: {},
      flag: { x: 400, y: 300 },
      interval: null
    };

    this.rooms.set(code, room);
    this.joinRoom(socket, room, nickname, 'conejos');
    this.startRoomLoop(room);
  }

  handleJoin(socket, code, nickname, reconnectToken, ip) {
    const room = this.rooms.get(code?.toUpperCase());
    if (!room) {
      socket.emit('error_message', 'La sala no existe.');
      return;
    }

    // Alternar equipo entre conejos y venados según la cantidad de jugadores
    const count = Object.keys(room.players).length;
    const team = count % 2 === 0 ? 'conejos' : 'venados';

    this.joinRoom(socket, room, nickname, team);
  }

  joinRoom(socket, room, nickname, team) {
    socket.join(room.code);
    
    // Crear datos del jugador
    room.players[socket.id] = {
      id: socket.id,
      nickname: nickname || 'Jugador',
      team: team, // 'conejos' o 'venados'
      x: Math.floor(Math.random() * 500) + 100,
      y: Math.floor(Math.random() * 400) + 100,
      radius: 20,
      speed: 5,
      keys: { up: false, down: false, left: false, right: false }
    };

    socket.emit('room_joined', { code: room.code, playerId: socket.id });
  }

  handleInput(socketId, inputData) {
    for (const room of this.rooms.values()) {
      if (room.players[socketId]) {
        room.players[socketId].keys = inputData;
        break;
      }
    }
  }

  handleDisconnect(socketId) {
    for (const [code, room] of this.rooms.entries()) {
      if (room.players[socketId]) {
        delete room.players[socketId];
        
        // Si la sala queda vacía, se destruye
        if (Object.keys(room.players).length === 0) {
          clearInterval(room.interval);
          this.rooms.delete(code);
        }
        break;
      }
    }
  }

  startRoomLoop(room) {
    if (room.interval) return;

    // Actualización de física a 60 FPS
    room.interval = setInterval(() => {
      Object.values(room.players).forEach(player => {
        if (player.keys.up) player.y -= player.speed;
        if (player.keys.down) player.y += player.speed;
        if (player.keys.left) player.x -= player.speed;
        if (player.keys.right) player.x += player.speed;
      });

      // Emitir el estado actualizado de la partida a la sala
      this.io.to(room.code).emit('game_update', {
        players: room.players,
        flag: room.flag
      });
    }, 1000 / 60);
  }
}

module.exports = { RoomManager };
