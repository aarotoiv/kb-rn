import { 
    TEST_TYPE,
    SOCKET_JOINING,
    SOCKET_JOINED,
    SOCKET_CONNECTING,
    SOCKET_CONNECTED,
    UPDATE_PLAYERS,
    PLAYER_JUMP,
    PLAYER_VELOCITY,
    PLAYER_LEFT
} from '../actions/types';

const INITIAL_STATE = {
    socket: null,
    joining: false,
    joined: false,
    connecting:false,
    connected: false,
    players: {},
    playerListData: {},
    yourId: null
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SOCKET_CONNECTING: 
            return {...state, connecting: true, connected: false};
        case SOCKET_CONNECTED:
            return {...state, socket: action.payload, connecting: false, connected: true};
        case SOCKET_JOINED: 
            return {...state, players: action.payload.players, playerListData: action.payload.playerListData, yourId: action.payload.yourId, joined: true};
        case UPDATE_PLAYERS: 
            return {...state, players: action.payload};
        case PLAYER_JUMP: 
            const jumpPlayer = state.players[action.payload];
            if(jumpPlayer)
                jumpPlayer.jump();
            return {...state, players: {...state.players, [action.payload]: jumpPlayer}};
        case PLAYER_VELOCITY:
            const velPlayer = state.players[action.payload.id];
            if(velPlayer)
                velPlayer.velocityUpdate(action.payload.right, action.payload.left);
            return {...state, players: {...state.players, [action.payload.id]: velPlayer}};
        case PLAYER_LEFT:
            let leftPlayers = state.players;
            delete leftPlayers[action.payload.id];
            return {...state, players: leftPlayers};
        default:
            return state;
    }
};