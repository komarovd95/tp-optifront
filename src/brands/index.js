import { combineReducers } from 'redux';
import list from './list/list';
import edit from './edit/edit';


export default combineReducers({
  edit,
  list
});
