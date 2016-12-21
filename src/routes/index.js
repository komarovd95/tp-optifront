import { combineReducers } from 'redux';
import list from './list/list';
import view from './view/view';


export default combineReducers({
  list,
  view
});
