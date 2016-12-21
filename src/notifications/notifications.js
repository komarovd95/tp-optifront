import { createAction } from 'redux-actions';
import { ERROR } from './constants';


const RESET = 'notifications/RESET';

const initialState = {
  message: '',
  level: '',
  isActive: false
};

export default function reducer(state = initialState, action) {
  if (action.type === RESET) {
    return initialState;
  } else if (action.meta && action.meta.notifyGlobal) {
    return {
      isActive: true,
      message: action.payload.message,
      level: action.meta.level
    };
  } else {
    return state || initialState;
  }
}

export const createNotify = actionType => createAction(actionType, data => data,
  (data = {}) => ({
    notifyGlobal: data.notifyGlobal || false,
    level: data.level || ERROR
  }));

export const resetNotification = createAction(RESET);
