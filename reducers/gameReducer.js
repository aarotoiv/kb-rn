import { TEST_TYPE, SOCKET_JOINING, SOCKET_JOINED, SOCKET_CONNECTING, SOCKET_CONNECTED } from '../actions/types';

const INITIAL_STATE = {
    socket: null,
    joining: false,
    joined: false,
    connecting:false,
    connected: false
    
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SOCKET_CONNECTING: 
            return {...state, connecting: true, connceted: false};
        case SOCKET_CONNECTED:
            console.log(action.payload);
            return {...state, socket: action.payload, connecting: false, connected: true};
        default:
            return state;
    }
};