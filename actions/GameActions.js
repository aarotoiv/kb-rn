import axios from 'axios';
import { TEST_TYPE, SOCKET_JOINED, SOCKET_JOINING, SOCKET_CONNECTED, SOCKET_CONNECTING } from './types';
import Player from '../game/Player';
import SocketHandler from '../game/SocketHandler';

export const socketConnect = () => {
    return (dispatch) => {
        dispatch({
            type: SOCKET_CONNECTING
        });
        SocketHandler.initialize()
        .then(function(res) {
            SocketHandler.listeners(
                res, 
                youJoined
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

const youJoined = (data) => {
    console.log("YOU HAVE JOINED",
    DATA);
};