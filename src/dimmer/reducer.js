import {handleActions} from 'redux-actions';
import { GLOBAL_FETCH_START, GLOBAL_FETCH_END } from './actionTypes';


export default handleActions({
  [GLOBAL_FETCH_START]: (state, action) => ({
    ...state,
    active: true
  }),

  [GLOBAL_FETCH_END]: (state, action) => ({
    ...state,
    active: false
  })
}, { active: false });
