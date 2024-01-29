var express = require('express');
var app = express();
var authentication = require('./authentication');
var EventCode = require('./eventCode');
var timePing = 0;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', "./views");

var server= require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);
console.log('Server Connected');  

io.on("connection", (socket) =>{
    console.log('Client Connected in socket id: ', socket.id);
    timePing = 0;
    setInterval(()=>{
        if(timePing >= 5) {
            console.log('Client not feedback');
            timePing = 0;
        }
        timePing++;
        socket.emit(EventCode.SERVER.PING);
    },2000)
    
    socket.on(EventCode.SERVER.PONG, ()=> {
        timePing = 0;
    })

    socket.on('disconnect', ()=>{});
    socket.on(EventCode.SERVER.GENERATE_TOKEN, (data)=>{
        let response = authentication.checkToken(data);
        socket.emit(EventCode.SERVER.EVENT, response);
    });

    socket.on(EventCode.SERVER.LOGIN, (payload)=>{
        let response = authentication.checkIdentity(payload);
        socket.emit(EventCode.SERVER.EVENT, response);
    })
})