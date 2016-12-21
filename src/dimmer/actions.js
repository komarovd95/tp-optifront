import {createAction} from 'redux-actions';
import { GLOBAL_FETCH_START, GLOBAL_FETCH_END } from './actionTypes';


export const globalFetchStart = createAction(GLOBAL_FETCH_START);
export const globalFetchEnd   = createAction(GLOBAL_FETCH_END);
