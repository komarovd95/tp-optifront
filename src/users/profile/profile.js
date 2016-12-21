import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { INFO } from '../../notifications/constants';
import { globalFetchStart, globalFetchEnd } from '../../app/app';
import { fetchOne, remove, change } from '../users';
import { stringToRoles, stringToDriveStyle } from '../model';
import { signInSuccess } from '../auth/auth';


const FETCH_REQUEST  = 'users/profile/FETCH_USER_REQUEST';
const FETCH_SUCCESS  = 'users/profile/FETCH_USER_SUCCESS';
const FETCH_FAILURE  = 'users/profile/FETCH_USER_FAILURE';

const DELETE_REQUEST = 'users/profile/DELETE_REQUEST';
const DELETE_SUCCESS = 'users/profile/DELETE_SUCCESS';
const DELETE_FAILURE = 'users/profile/DELETE_FAILURE';

const CHANGE_REQUEST = 'users/profile/CHANGE_REQUEST';
const CHANGE_SUCCESS = 'users/profile/CHANGE_SUCCESS';
const CHANGE_FAILURE = 'users/profile/CHANGE_FAILURE';


const initialState = {
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        user: action.payload
      };

    case FETCH_FAILURE:
      return initialState;

    default:
      return state;
  }
}


export const fetchUserRequest = createAction(FETCH_REQUEST);
export const fetchUserSuccess = createAction(FETCH_SUCCESS);
export const fetchUserFailure = createNotify(FETCH_FAILURE);

export const fetchUser = id => (dispatch, getState) => {
  dispatch(fetchUserRequest());

  const loggedUser = getState().auth.user;

  if (loggedUser && loggedUser.id == id) {
    return new Promise(resolve => {
      dispatch(fetchUserSuccess(loggedUser));
      resolve(loggedUser);
    });
  } else if (id && id.match(/^([0-9]+)$/)) {
    dispatch(globalFetchStart());

    return dispatch(fetchOne(id))
      .then(user => {
        dispatch(globalFetchEnd());
        dispatch(fetchUserSuccess(user));
        return user;
      })
      .catch(error => {
        dispatch(globalFetchEnd());
        dispatch(fetchUserFailure({
          message: 'Ошибка при загрузке профиля! Попробуйте позже',
          notifyGlobal: true
        }));

        throw error;
      });
  } else {
    return new Promise((resolve, reject) => {
      dispatch(fetchUserFailure());
      browserHistory.push('/404');
      reject();
    });
  }
};


export const deleteUserRequest = createAction(DELETE_REQUEST);
export const deleteUserSuccess = createNotify(DELETE_SUCCESS);
export const deleteUserFailure = createNotify(DELETE_FAILURE);

export const deleteUser = () => (dispatch, getState) => {
  dispatch(deleteUserRequest());

  const user = getState().users.profile.user;

  if (user) {
    return dispatch(remove(user))
      .then(() => {
        dispatch(deleteUserSuccess({
          message: `Пользователь ${user.username} успешно удален!`,
          level: INFO,
          notifyGlobal: true
        }));
      })
      .catch(() => dispatch(deleteUserFailure({
        message: 'Ошибка при удалении пользователя',
        notifyGlobal: true
      })));
  } else {
    return new Promise((resolve, reject) => reject());
  }
};


export const changeUserRequest = createAction(CHANGE_REQUEST);
export const changeUserSuccess = createNotify(CHANGE_SUCCESS);
export const changeUserFailure = createNotify(CHANGE_FAILURE);

export const changeUser = values => (dispatch, getState) => {
  dispatch(changeUserRequest());

  const profileUser = getState().users.profile.user;

  return dispatch(change(profileUser, {
    password: values.password,
    roles: values.roles && stringToRoles(values.roles),
    driveStyle: stringToDriveStyle(values.driveStyle)
  })).then(user => {
    dispatch(changeUserSuccess({
      message: `Пользователь ${user.username} успешно обновлен!`,
      notifyGlobal: true,
      level: INFO
    }));

    dispatch(fetchUserSuccess(user));

    if (user.id === getState().auth.user.id) {
      dispatch(signInSuccess(user));
    }

    return user;
  }).catch(() => dispatch(changeUserFailure({
    message: 'Ошибка при обновлении данных',
    notifyGlobal: true
  })));
};
