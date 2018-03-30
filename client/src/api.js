import io from 'socket.io-client';
const socket = io();

function subscribeToTimer(interval, cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', interval);
}

function postMove(source, target, gameId) {
    socket.emit('postMove', source, target, gameId);
}

function pgnUpdater(cb) {
    socket.on('sendPGN', PGN => cb(null, PGN));
}

export { subscribeToTimer, postMove, pgnUpdater };