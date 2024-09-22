const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api/graphql', require('./routes/graphqlRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  path: '/socket',
  cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => require('./routes/socketRoutes')(socket, io));

server.listen(process.env.PORT || 8000);
