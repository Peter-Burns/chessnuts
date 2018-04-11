import io from 'socket.io-client';
const socket = io();

function leaveGame(){
    socket.disconnect();
}

function postMove(source, target, gameId) {
    socket.emit('postMove', source, target, gameId);
}

function pgnUpdater(cb) {
    socket.on('sendPGN', PGN => cb(null, PGN));
}

export { postMove, pgnUpdater, leaveGame };