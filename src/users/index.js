import { combineReducers } from 'redux';
import profile from './profile/profile';
import list from './list/list';

export default combineReducers({
  list,
  profile
});
