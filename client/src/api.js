import io from 'socket.io-client';
const socket = io();


function subscribeToTimer(interval, cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', interval);
}
export { subscribeToTimer }