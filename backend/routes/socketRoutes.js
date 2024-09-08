const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;

const { getRedisKey } = require('../utils/redis');

module.exports = function handleSocket(socket, io) {
  socket.on('join', async (roomName, token) => {
    try {
      let decoded, username;
      if (token) {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        username = (await getRedisKey(decoded.name)).name;
      } else {
        username = uuid();
      }

      socket.join(roomName);

      socket.broadcast.to(roomName).emit('newUser', { 
        id: socket.id, 
        name: username 
      });
      
      socket.on('call', (details) => (
        io.to(details.to).emit('call', { ...details, caller: username, from: socket.id })
      ));

      socket.on('accept', (details) => (
        io.to(details.to).emit('accept', details.signal)
      ));

      socket.on('disconnect', () => socket.broadcast.emit('exit', username));

    } catch (error) {
      console.error(error);
      socket.disconnect();
    }
  });
}
