var express = require('express');
var app = express();
var authentication = require('./authentication');
var EventCode = require('./eventCode');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', "./views");

var server= require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
console.log('Server Connected');    
io.on("connection", (socket) =>{
    console.log('Client Connected in socket id: ', socket.id);
    socket.on('disconnect', ()=>{});
    socket.on(EventCode.SERVER.GENERATE_TOKEN, (data)=>{
        let response = authentication.getToken(data);
        console.log(response);
        // io.emit(EventCode.SERVER.RECEIVED_TOKEN, response);
        io.emit('event', response);
    });
    socket.on(EventCode.SERVER.IDENTIFY, (payload)=>{
        let response = authentication.checkIdentity(payload);
        // io.emit(EventCode.SERVER.LOGIN, response);
        io.emit('event', response);
    })
})