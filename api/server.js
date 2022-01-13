const express = require('express');

const userRouter = require('./users/users-router');

const server = express();

// remember express by default cannot parse JSON in request bodies

server.use(express.json());

// global middlewares and the user's router need to be connected here

server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res) => {
  res.status(404).json({
    message: `${req.method} ${req.baseUrl} not found`
  });
});

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: `${err.message}`
  });
});


module.exports = server;
