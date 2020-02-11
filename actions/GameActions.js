import axios from 'axios';
import { TEST_TYPE } from './types';

export const testIt = () => {
    return {
        type: TEST_TYPE,
        payload: "Anal"
    };
}