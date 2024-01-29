var EventCode = require('./eventCode');

var userNames = [];
var tokens = []

function setUserName(userName){
        userNames.push(userName);
}

function checkToken(userName){
    for(let i =  0; i < userNames.length ; i++){
        if(userNames[i] == userName) {
            return EventCode.SERVER.TOKEN_EXISTED;
        }
    }
    setUserName(userName);
    let tokenGenerate = generateToken(userName)
    let response = {
        event: EventCode.SERVER.RECEIVED_TOKEN,
        data: {
            token: tokenGenerate,
        }
    }
    tokens.push(response.data.token);
    return response;

}

function generateToken(userName) {
    const timestamp = new Date().getTime().toString();
    const shortToken = timestamp.slice(-6);
    const tokenWithUsername = `${userName}_${shortToken}`;
    return tokenWithUsername;
}

function getToken(userName) {
    return checkToken(userName);
}

function checkIdentity(payload) {
    console.log(payload);
    console.log(userNames, tokens);
    let userName = payload.data.userName;
    let token = payload.data.token;
    for(let i = 0; i < userNames.length; i++) {
        if(userName == userNames[i] && token == tokens[i]){
            let response = {
                event: EventCode.SERVER.IDENTIFY,
                data: {
                    userName: userName,
                    token: token,
                }
            }
            return response;
        }
    }

    return false;
}

module.exports = {
    getToken,
    checkIdentity,
}