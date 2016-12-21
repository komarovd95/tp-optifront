import {combineReducers} from 'redux';

import {routerReducer} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';
import {dimmerReducer} from '../dimmer';

import app from '../app/app';
import auth from '../users/auth';
import brands from '../brands';
import cars from '../cars';
import cache from '../cache';
import coverTypes from '../coverTypes';
import fuelTypes from '../fuelTypes';
import modal from '../modal/modal';
import notifications from '../notifications/notifications';
import routes from '../routes/';
import streets from '../streets';
import users from '../users';


export default combineReducers({
  app,
  auth,
  brands,
  cars,
  cache,
  coverTypes,
  fuelTypes,
  modal,
  notifications,
  routes,
  streets,
  users,
  dimmer: dimmerReducer,
  routing: routerReducer,
  form: formReducer
});
