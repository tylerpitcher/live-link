const jwt = require('jsonwebtoken');

const { getRedisKey } = require('../utils/redis');

module.exports = function handleSocket(socket, io) {
  socket.on('join', async (roomName, token) => {
    try {
      if (!token) socket.disconnect();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getRedisKey(decoded.name);

      socket.join(roomName);

      socket.broadcast.to(roomName).emit('newUser', { 
        id: socket.id, 
        name: user.name 
      });
      
      socket.on('call', (details) => (
        io.to(details.to).emit('call', { ...details, from: socket.id })
      ));

      socket.on('accept', (details) => (
        io.to(details.to).emit('accept', details.signal)
      ));

      socket.on('disconnect', () => socket.broadcast.emit('exit', user.name));

    } catch (error) {
      console.error(error);
      socket.disconnect();
    }
  });
}
