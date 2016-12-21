import { handleActions } from 'redux-actions';
import * as types from '../actionTypes';
import vis from 'vis';


const INITIAL_STATE = {
  entities: null,
  result: null
};

export default handleActions({
  [types.LOAD_SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload
  })
}, INITIAL_STATE);
