const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const ACTIONS = require('./src/Actions');

const server = http.createServer(app);
const io = new Server(server);

mongoose.connect('mongodb+srv://dheerajcl:Dheer%40j12@cluster0.ukvgapl.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

const Room = mongoose.model('Room', {
  roomId: String,
});

app.use(express.static('build'));
app.use(express.json()); // Parse JSON in requests

app.post('/create-room', async (req, res) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Check if the room ID already exists
    const existingRoom = await Room.findOne({ roomId });

    if (existingRoom) {
      return res.status(409).json({ error: 'Room ID already exists' });
    }

    // Save the new room ID to the database
    const newRoom = new Room({ roomId });
    await newRoom.save();

    return res.json({ success: true, roomId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/join-room', async (req, res) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Check if the room ID exists
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) {
      return res.status(404).json({ error: 'Invalid Room ID' });
    }

    return res.json({ success: true, roomId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
