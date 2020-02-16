import io from 'socket.io-client';
import axios from 'axios';

const URI = 'http://kingofbuttons.herokuapp.com';//http://localhost:5000';

export default {
    async getExistingUser() {
        const res = await axios.get(URI + '/existing_user', {withCredentials: true});
        return res.data.userName;
    },
    async initialize() {
        const res = await axios.get(URI + '/', {withCredentials: true});
        console.log(res);
        const socket = await io(URI, {withCredentials: true});
        console.log("socket initialized");
        return socket;
    },
    listeners(socket, youJoined/*, playerJoined, playerLeft, playerPositionUpdate, playerVelocityUpdate, playerJumpUpdate, youClicked, playerClicked, newButton*/) {
        socket.on('youJoined', function(data) {
            youJoined(data.id, data.userName, data.existingPlayers, data.color, data.buttons, data.points);
        });
        /*socket.on('playerJoined', function(data) {
            playerJoined(data.id, data.userName, data.x, data.color, data.points);
        });
        socket.on('youLeft', function() {
            console.log("YOU HAVE LEFT");
        });
        socket.on('playerLeft', function(data) {
            playerLeft(data.id);
        });
        socket.on('playerPosition', function(data) {
            playerPositionUpdate(data.id, data.x, data.y);
        });
        socket.on('playerVelocity', function(data) {
            playerVelocityUpdate(data.id, data.right, data.left);
        });
        socket.on('playerJump', function(data) {
            playerJumpUpdate(data.id);
        });
        socket.on('youClicked', function(data) {
            youClicked(data.points, data.hitsTillPrize);
        });
        socket.on('playerClicked', function(data) {
            playerClicked(data.socketId, data.id, data.points);
        });
        socket.on('newButton', function(data) {
            newButton(data.button);
        });*/
    },
    join(socket, userName, spawnX) {
        socket.emit('join', {userName, x: spawnX});
    },
    /*leave(socket) {
        socket.emit('leave', {});
    },
    posUpdate(socket, x, y) {
        socket.emit('positionUpdate', {x, y});
    },
    velUpdate(socket, right, left) {
        socket.emit('velocityUpdate', {right, left});
    },
    jumpUpdate(socket) {
        socket.emit('jumpUpdate', {});
    },
    buttonHit(socket, id) {
        socket.emit('buttonHit', {id});
    }*/
}