const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const routes = require('./routes');
const mongoose = require('mongoose');
const morgan = require('morgan');
const LocalStrategy = require('passport-local').Strategy;
const http = require('http');
const passport = require('passport');
const bodyParser = require('body-parser');
const io = require('socket.io')();
const cookieparser = require('cookie-parser');
const session = require('express-session');
const axios = require('axios');
const Chess = require('chess.js').Chess;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/chessnuts";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {});

const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cookieparser());
app.use(session({
  // this should be changed to something cryptographically secure for production
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: 'sid', // don't use the default session cookie name
  // set your options for the session cookie
  cookie: {
    httpOnly: true,
    // the duration in milliseconds that the cookie is valid
    maxAge: 120 * 60 * 1000, // 120 minutes
    // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
    // domain: 'your.domain.com',
    // recommended you use this setting in production if your site is published using HTTPS
    // secure: true,
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("client/build"));
app.use(routes);

io.on('connection', (client) => {
  // here you can start emitting events to the client 
  console.log(client.handshake.headers.referer);
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });

  client.on('postMove', (source, target, gameId) => {
    console.log('Client posted a move', source, target, gameId);
    axios.get(process.env.NODE_ENV === 'production' ? 'https://chessnuts.herokuapp.com' : 'http://localhost:3001' + '/api/games/' + gameId)
      .then(res => {
        game = new Chess();
        game.load_pgn(res.data.pgn);
        const move = game.move({
          from: source,
          to: target,
          promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        if (move) {
          io.emit('sendPGN', game.pgn());
          axios.put(process.env.NODE_ENV === 'production' ? 'https://chessnuts.herokuapp.com' : 'http://localhost:3001' + '/api/games/' + gameId, {
            pgn: game.pgn()
          });
        }
        else client.emit('sendPGN', 'Invalid move');
      })
      .catch(err => console.log(err));
  });

});

const server = app.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});

io.listen(server);