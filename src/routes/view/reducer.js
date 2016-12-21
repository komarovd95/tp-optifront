import { combineReducers } from 'redux';
import dataReducer from './reducers/DataReducer';


export default combineReducers({
  data: dataReducer
});
