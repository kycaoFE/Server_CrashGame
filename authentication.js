var EventCode = require('./eventCode');
const fs = require('fs');

var users = {
        
}
fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      try {
        users = JSON.parse(data);
        console.log(users);
      } catch (parseError) {
        console.error(parseError);
      }
}});

function updateUser(){
    let jsonData = JSON.stringify(users, null, 2);
    fs.writeFile('users.json', jsonData, 'utf8', (err) => {

    });
    console.log(users);

}

function setUserName(userName, token){
    let newUser = {
        token: token,
    }
    users[userName] = newUser;
}

function checkToken(userName){
    let response = {
        event: EventCode.SERVER.RECEIVED_TOKEN,
        data: {
            
        }
    }
    for(let user in users){
        if(user == userName) {
            response.data.token = EventCode.SERVER.TOKEN_EXISTED
            return response;
        }
    }

    response.data.token = generateToken(userName);
    setUserName(userName, response.data.token);
    updateUser();
    return response;

}

function generateToken(userName) {
    const timestamp = new Date().getTime().toString();
    const shortToken = timestamp.slice(-6);
    const tokenWithUsername = `${userName}_${shortToken}`;
    return tokenWithUsername;
}

function checkIdentity(payload) {
    let userName = payload.data.userName;
    let token = payload.data.token;
    let response = {
        event: EventCode.SERVER.IDENTIFY,
        data: {

        }
    }
    for (let user in users) {
        if(userName == user && token == user.token){
            response.data.userName = userName;
            response.data.token = token;
            return response;
        }
    }
    response.data = null;
    return response;
}

module.exports = {
    checkToken,
    checkIdentity,
}