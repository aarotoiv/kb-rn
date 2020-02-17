import { 
    TEST_TYPE,
    SOCKET_JOINING,
    SOCKET_JOINED,
    SOCKET_CONNECTING,
    SOCKET_CONNECTED,
    UPDATE_PLAYERS,
    PLAYER_JUMP,
    PLAYER_VELOCITY,
    PLAYER_LEFT,
    PLAYER_POSITION,
    PLAYER_JOINED
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
            if(action.payload && state.players[action.payload]) {
                let jumpPlayer = state.players[action.payload];
                jumpPlayer.jump();
                return {...state, players: {...state.players, [action.payload]: jumpPlayer}};
            }
            return {...state};
           
        case PLAYER_VELOCITY:
            if(action.payload.id && state.players[action.payload.id]) {
                let velPlayer = state.players[action.payload.id];
                velPlayer.velocityUpdate(action.payload.right, action.payload.left);
                return {...state, players: {...state.players, [action.payload.id]: velPlayer}};
            }
            return {...state}

        case PLAYER_LEFT:
            let leftPlayers = Object.assign({}, state.players);
            delete leftPlayers[action.payload];
            let leftPlayerList = Object.assign({}, state.playerListData);
            delete leftPlayerList[action.payload];
            return {...state, players: leftPlayers, playerListData: leftPlayerList};
            
        case PLAYER_POSITION:
            if(action.payload.id && state.players[action.payload.id]) {
                let positionPlayer = state.players[action.payload.id];
                positionPlayer.syncPos(action.payload.x, action.payload.y);
                return {...state, players: {...state.players, [action.payload.id]: positionPlayer}};
            } 
            return {...state};
        
        case PLAYER_JOINED:
            return {...state, players: {...state.players, [action.payload.id]: action.payload.player}, playerListData: {...state.playerListData, [action.payload.id]: {name: action.payload.userName, points: action.payload.points}}};

        default:
            return state;
    }
};