import axios from 'axios';
import { 
    TEST_TYPE,
    SOCKET_JOINED,
    SOCKET_JOINING,
    SOCKET_CONNECTED,
    SOCKET_CONNECTING,
    UPDATE_PLAYERS,
    PLAYER_JUMP,
    PLAYER_VELOCITY,
    PLAYER_LEFT
} from './types';
import { Dimensions } from 'react-native';
import Player from '../game/Player';
import { graphicMod as gM } from '../util';
import SocketHandler from '../game/SocketHandler';
import { Actions } from 'react-native-router-flux';

export const socketConnect = () => {
    return (dispatch) => {
        dispatch({
            type: SOCKET_CONNECTING
        });
        SocketHandler.initialize()
        .then(function(res) {
            SocketHandler.listeners(
                res, 
                dispatch,
                youJoined,
                playerJump,
                playerVelocity,
                playerLeft
            );
            dispatch({
                type: SOCKET_CONNECTED,
                payload: res
            });
        })
        .catch(function(err) {
            console.log(err);
        });
        
    }
    
}

const youJoined = data => {
    const { width } = Dimensions.get('window');
    let playerKeys = Object.keys(data.existingPlayers);
    let playerData = Object.values(data.existingPlayers);
    let players = {};
    let playerListData = {};

    players[data.id] = Player.newPlayer(500, 0, data.color, gM(width));
    playerListData[data.id] = {
        name: data.userName,
        points: data.points
    };
    
    for(let i = 0; i<playerKeys.length; i++) {
        players[playerKeys[i]] = Player.newPlayer(playerData[i].x, 0, playerData[i].color, gM(width));
        playerListData[playerKeys[i]] = {
            name: playerData[i].userName,
            points: playerData[i].points
        };    
    }

    return {
        type: SOCKET_JOINED,
        payload: {
            players, playerListData, yourId: data.id
        }
    };
    
};

export const updatePlayers = (players, updateRate, platform) => {
    const keys = Object.keys(players);
    for(let i = 0; i<keys.length; i++) {
        players[keys[i]].update(updateRate);
        players[keys[i]].checkCollisions(platform);
    }
    return {
        type: UPDATE_PLAYERS,
        payload: players
    };
};

export const playerJump = (id, socket) => {
    if(socket)
        SocketHandler.jumpUpdate(socket, id);
    return {
        type: PLAYER_JUMP,
        payload: id
    };
};

export const playerVelocity = (id, right, left, socket) => {
    if(socket) 
        SocketHandler.velUpdate(socket, right, left);
    return {
        type: PLAYER_VELOCITY,
        payload: {id, right, left}
    };
};

export const playerLeft = (id) => {
    return {
        type: PLAYER_LEFT,
        payload: id
    };
}