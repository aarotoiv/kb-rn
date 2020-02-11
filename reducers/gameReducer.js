import { TEST_TYPE } from '../actions/types';

const INITIAL_STATE = {
    kysta: "anaa"
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case TEST_TYPE: 
            return {...state, kysta: action.payload};
        default:
            return state;
    }
};