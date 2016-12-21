import { createAction } from 'redux-actions';
import { createNotify } from '../../notifications/notifications';
import { globalFetchStart, globalFetchEnd } from '../../app/app';
import { fetchApi, storeData, retrieveData, removeData } from '../../api';
import { PathUser } from '../model';
import { LOGIN_ITEM_NAME } from './constants';
import { RESOURCE_URL } from '../constants';
import { create } from '../users';


const SIGN_IN_REQUEST = 'auth/SIGN_IN_REQUEST';
const SIGN_IN_SUCCESS = 'auth/SIGN_IN_SUCCESS';
const SIGN_IN_FAILURE = 'auth/SIGN_IN_FAILURE';

const SIGN_UP_REQUEST = 'auth/SIGN_UP_REQUEST';
const SIGN_UP_SUCCESS = 'auth/SIGN_UP_SUCCESS';
const SIGN_UP_FAILURE = 'auth/SIGN_UP_FAILURE';

const SIGN_OUT = 'auth/SIGN_OUT';

const CHECK_USERNAME_REQUEST = 'auth/CHECK_USERNAME_REQUEST';
const CHECK_USERNAME_SUCCESS = 'auth/CHECK_USERNAME_SUCCESS';
const CHECK_USERNAME_FAILURE = 'auth/CHECK_USERNAME_FAILURE';


const initialState = {
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return {
        user: action.payload
      };

    case SIGN_OUT:
      return {
        user: null
      };

    default:
      return state;
  }
}

export const signInRequest = createAction(SIGN_IN_REQUEST);
export const signInSuccess = createAction(SIGN_IN_SUCCESS);
export const signInFailure = createNotify(SIGN_IN_FAILURE);

export const signIn = ({ username, password }) => dispatch => {
  const authToken = Buffer.from(username.trim() + ':' + password.trim(), 'ascii')
    .toString('base64');

  const config = {
    url: `${RESOURCE_URL}/user`,
    headers: {
      'Authorization': `Basic ${authToken}`
    }
  };

  dispatch(signInRequest());

  return dispatch(fetchApi(config))
    .then(data => {
      const user = new PathUser(data);

      dispatch(signInSuccess(user));

      dispatch(storeData(LOGIN_ITEM_NAME, authToken));

      return user;
    })
    .catch(error => {
      if (error.status === 401) {
        dispatch(signInFailure());
      } else {
        dispatch(signInFailure({
          message: 'Не удалось войти в систему. Попробуйте позже',
          notifyGlobal: true
        }));
      }

      throw error;
    });
};


const signUpRequest = createAction(SIGN_UP_REQUEST);
const signUpSuccess = createAction(SIGN_UP_SUCCESS);
const signUpFailure = createNotify(SIGN_UP_FAILURE);

export const signUp = ({ username, password }) => dispatch => {
  dispatch(signUpRequest());

  return dispatch(create({ username, password }))
    .then(() => dispatch(signIn({ username, password })))
    .then(user => {
      dispatch(signUpSuccess(user));
      return user;
    })
    .catch(error => {
      dispatch(signUpFailure({
        message: 'Не удалось зарегистрироваться. Попробуйте позже',
        notifyGlobal: true
      }));

      throw error;
    });
};


const checkUsernameRequest = createAction(CHECK_USERNAME_REQUEST);
const checkUsernameSuccess = createAction(CHECK_USERNAME_SUCCESS);
const checkUsernameFailure = createNotify(CHECK_USERNAME_FAILURE);

export const checkUsername = username => dispatch => {
  dispatch(checkUsernameRequest());

  const config = {
    url: `${RESOURCE_URL}/search/findByUsernameExists`,
    params: {
      username
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      dispatch(checkUsernameSuccess());

      if (data) {
        return Promise.reject({
          username: [`Имя ${username} уже занято`],
          _error: [`Имя ${username} уже занято`]
        });
      } else {
        return Promise.resolve();
      }
    })
    .catch(error => {
      if (error.status) {
        dispatch(checkUsernameFailure({
          message: 'Ошибка на сервере. Попробуйте позже',
          notifyGlobal: true
        }));
      }

      throw error;
    });
};


export const signOutAction = createAction(SIGN_OUT);

export const signOut = () => dispatch => {
  return new Promise(resolve => {
    dispatch(signOutAction());
    resolve(dispatch(removeData(LOGIN_ITEM_NAME)));
  }).catch(() => {});
};


export const trySignIn = () => (dispatch, getState) => {
  dispatch(globalFetchStart({ message: 'Вход в систему...' }));

  const loggedUser = getState().auth.user;

  if (loggedUser) {
    return new Promise(resolve => {
      dispatch(globalFetchEnd());
      resolve(loggedUser);
    });
  } else {
    return dispatch(retrieveData(LOGIN_ITEM_NAME))
      .then(data => {
        const [username, password] = Buffer.from(data, 'base64')
          .toString('ascii').split(':');

        return dispatch(signIn({username, password}));
      })
      .then(user => {
        dispatch(globalFetchEnd());
        return user;
      })
      .catch(error => {
        dispatch(globalFetchEnd());
        throw error;
      });
  }
};

