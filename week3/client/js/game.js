var socket = io();

//Sign in client code
var signDiv = document.getElementById('signInDiv');
var signDivUsername = document.getElementById('signInDiv-username');
var signDivSignIn = document.getElementById('signInDiv-signIn');
var signDivSignUp = document.getElementById('signInDiv-signUp');
var signDivPassword = document.getElementById('signInDiv-password');
var gameDiv = document.getElementById('gameDiv');
var error = document.getElementById('err');

//Add event listeners for sign in buttons
signDivSignIn.onclick = function(){
    socket.emit('signIn', {username:signDivUsername.value, password:signDivPassword.value});
}

signDivSignUp.onclick = function(){
    socket.emit('signUp', {username:signDivUsername.value, password:signDivPassword.value});
}

socket.on('signInResponse', function(data){
    if(data.success){
        signDiv.style.display = "none";
        gameDiv.style.display = "inline-block";
    } else {
        //alert("Fail login");
        error.innerHTML = "Fail Login.";
    }
})

socket.on('signUpResponse', function(data){
    if(data.success){
        error.innerHTML = "Sign Up Successful, Please Login";
    } else {
        //alert("Fail login");
        error.innerHTML = "Sign Up Failed.";
    }
})

//Game Related Code
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var px = 0;
var py = 0;
var clientId;
ctx.font = '30px Arial';

var Sprites = {}
Sprites.player = new Image();
Sprites.player.src = '/client/images/player.png'
Sprites.fireball = new Image();
Sprites.fireball.src = '/client/images/Fireball.png'
Sprites.map = new Image();
Sprites.map.src = '/client/images/Tilemap.png'

var drawMap = function(){
    ctx.drawImage(Sprites.map,0,0,800,600); 
}

var drawScore = function(){
    ctx.fillStyle = 'white';
    ctx.fillText(Player.list[clientId].score,0,70);
    ctx.fillStyle = 'black';
}

var Player = function(initPack){
    var self = {}

    self.id = initPack.id
    self.number = initPack.number
    self.x = initPack.x
    self.y = initPack.y
    self.hp = initPack.hp
    self.hpMax = initPack.hpMax
    self.score = initPack.score

    self.draw = function(){
        var hpWidth = 30 * self.hp/self.hpMax;
        ctx.fillStyle = 'red';
        ctx.fillRect(self.x - hpWidth/2, self.y - 50, hpWidth, 5);
        ctx.fillStyle = 'black';
        //ctx.fillText(self.number, self.x, self.y)
        //ctx.font = "20px Arial"
        //ctx.fillText(self.score, self.x, self.y - 60);
        //ctx.font = "30px Arial"
        ctx.drawImage(Sprites.player, self.x-10,self.y - 30,Sprites.player.width/4,Sprites.player.height/4);
    }

    Player.list[self.id] = self;

    return self;
}

Player.list = {}

var Bullet = function(initPack){
    var self = {}

    self.id = initPack.id
    self.x = initPack.x
    self.y = initPack.y

    self.draw = function(){
        //ctx.fillRect(self.x-5, self.y-5, 10, 10);
        ctx.drawImage(Sprites.fireball, self.x,self.y,Sprites.fireball.width/30,Sprites.fireball.height/30);
    }

    Bullet.list[self.id] = self;

    return self;
}



Bullet.list = {}

socket.on('connected', function(data){
    clientId = data;
    console.log(clientId);
});

//Init
socket.on('init', function(data){
    for(var i = 0; i < data.player.length; i++){
        new Player(data.player[i])
    }
    for(var i = 0; i < data.bullet.length; i++){
        new Bullet(data.bullet[i])
    }
})

//Update
socket.on('update', function(data){

    //Sets Player position
    for(var i = 0; i < data.player.length; i++){
        if(clientId == data.player[i].id){
            px = data.player[i].x;
            py = data.player[i].y;
        }
        //ctx.fillText(data.player[i].number, data.player[i].x,data.player[i].y);
        var pack = data.player[i];
        var p = Player.list[pack.id];

        if(p){
            if(pack.x !== undefined){
                p.x = pack.x;
            }
            if(pack.y !== undefined){
                p.y = pack.y;
            }
            if(pack.hp !== undefined){
                p.hp = pack.hp;
            }
            if(pack.hpMax !== undefined){
                p.hpMax = pack.hpMax;
            }
            if(pack.score !== undefined){
                p.score = pack.score;
            }
        }
    }

    for(var i = 0; i < data.bullet.length; i++){
        var pack = data.bullet[i];
        var b = Bullet.list[pack.id];

        if(b){
            if(pack.x !== undefined){
                b.x = pack.x;
            }
            if(pack.y !== undefined){
                b.y = pack.y;
            }
        }
    }
})

//Remove
socket.on('remove', function(data){
    for(var i = 0; i < data.player.length; i++){
        delete Player.list[data.player[i]]
    }
    for(var i = 0; i < data.bullet.length; i++){
        delete Bullet.list[data.bullet[i]]
    }
})

setInterval(function(){
    ctx.clearRect(0,0,800,600);
    drawMap();
    for(var i in Player.list){
        //Draw functions
        Player.list[i].draw();
    }
    for(var i in Bullet.list){
        //Draw functions
        Bullet.list[i].draw();
    }
    drawScore();
}, 1000/30)

//Event listeners for key presses & mouse clicks/position
document.addEventListener('keydown', keyPressDown);
document.addEventListener('keyup', keyPressUp);
document.addEventListener('mousedown', mouseDown);
document.addEventListener('mouseup', mouseUp);
document.addEventListener('mousemove', mouseMove);

function keyPressDown(e){
    if(e.keyCode === 87){ //Up (w)
        socket.emit('keypress', {inputId:'up', state: true})
    }
    else if(e.keyCode === 83){ //Down (s)
        socket.emit('keypress', {inputId:'down', state: true})
    }
    else if(e.keyCode === 68){ //Right (d)
        socket.emit('keypress', {inputId:'right', state: true})
    }
    else if(e.keyCode === 65){ //Left (a)
        socket.emit('keypress', {inputId:'left', state: true})
    }
}

function keyPressUp(e){
    if(e.keyCode === 87){ //Up (w)
        socket.emit('keypress', {inputId:'up', state: false})
    }
    else if(e.keyCode === 83){ //Down (s)
        socket.emit('keypress', {inputId:'down', state: false})
    }
    else if(e.keyCode === 68){ //Right (d)
        socket.emit('keypress', {inputId:'right', state: false})
    }
    else if(e.keyCode === 65){ //Left (a)
        socket.emit('keypress', {inputId:'left', state: false})
    }
}

function mouseDown(e){
    socket.emit('keypress', {inputId:'attack', state: true})
}

function mouseUp(e){
    socket.emit('keypress', {inputId:'attack', state: false})
}

function mouseMove(e){
    var x = -px + e.clientX - 8;
    var y = -py + e.clientY - 96;
    var angle = Math.atan2(y,x)/Math.PI*180;
    socket.emit('keypress', {inputId:'mouseAngle', state: angle})
}

/*
socket.on('newPositions', function(data){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(var i = 0; i < data.player.length; i++){
        if(clientId == data.player[i].id){
            px = data.player[i].x;
            py = data.player[i].y;
        }
        ctx.fillText(data.player[i].number, data.player[i].x,data.player[i].y);
    }

    for(var i = 0; i < data.bullet.length; i++){
        ctx.fillRect(data.bullet[i].x + 5,data.bullet[i].y - 10, 10, 10);
    }
});*/

socket.on('addToChat',function(data){
    chatText.innerHTML += `<div>${data}</div>`
})

socket.on('evalResponse',function(data){
    chatText.innerHTML += `<div>${data}</div>`
    console.log(data);
})

chatForm.onsubmit = function(e){
    e.preventDefault();
    if(chatInput.value[0] === '/'){
        socket.emit('evalServer', chatInput.value.slice(1));
    } else {
        socket.emit('sendMessageToServer', chatInput.value);
    }
    //Clear out the input field
    chatInput.value = "";
}

// var msg = function () {
//     socket.emit('sendBtnMsg', {
//         message: 'Sending Message from button'
//     });
// }
// socket.emit('sendMsg', {
//     message: 'Hello Devin I am logged in'
// });
// socket.on('messageFromServer', function (data) {
//     console.log(data.message);
// });