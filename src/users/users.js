import { createAction } from 'redux-actions';
import { RESOURCE_URL } from './constants';
import { LOGIN_ITEM_NAME } from './auth/constants';
import { fetchApi, storeData } from '../api';

import { PathUser, getUsersFromResponseData } from './model';


const FETCH_ONE_REQUEST = 'users/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS = 'users/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE = 'users/FETCH_ONE_FAILURE';

const FETCH_ALL_REQUEST = 'users/FETCH_ALL_REQUEST';
const FETCH_ALL_SUCCESS = 'users/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'users/FETCH_ALL_FAILURE';

const CREATE_REQUEST    = 'users/CREATE_REQUEST';
const CREATE_SUCCESS    = 'users/CREATE_SUCCESS';
const CREATE_FAILURE    = 'users/CREATE_FAILURE';

const CHANGE_REQUEST    = 'users/CHANGE_REQUEST';
const CHANGE_SUCCESS    = 'users/CHANGE_SUCCESS';
const CHANGE_FAILURE    = 'users/CHANGE_FAILURE';

const REMOVE_REQUEST    = 'users/REMOVE_REQUEST';
const REMOVE_SUCCESS    = 'users/REMOVE_SUCCESS';
const REMOVE_FAILURE    = 'users/REMOVE_FAILURE';

const ADD_CAR_REQUEST   = 'users/ADD_CAR_REQUEST';
const ADD_CAR_SUCCESS   = 'users/ADD_CAR_SUCCESS';
const ADD_CAR_FAILURE   = 'users/ADD_CAR_FAILURE';

const REMOVE_CAR_REQUEST = 'users/REMOVE_CAR_REQUEST';
const REMOVE_CAR_SUCCESS = 'users/REMOVE_CAR_SUCCESS';
const REMOVE_CAR_FAILURE = 'users/REMOVE_CAR_FAILURE';


export const fetchOneRequest = createAction(FETCH_ONE_REQUEST);
export const fetchOneSuccess = createAction(FETCH_ONE_SUCCESS);
export const fetchOneFailure = createAction(FETCH_ONE_FAILURE);

export const fetchOne = id => dispatch => {
  dispatch(fetchOneRequest());

  const config = {
    url: `${RESOURCE_URL}/${id}`
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const user = new PathUser(data);
      dispatch(fetchOneSuccess(user));
      return user;
    })
    .catch(error => {
      dispatch(fetchOneFailure(error));
      throw error;
    });
};


export const fetchAllRequest = createAction(FETCH_ALL_REQUEST);
export const fetchAllSuccess = createAction(FETCH_ALL_SUCCESS);
export const fetchAllFailure = createAction(FETCH_ALL_FAILURE);

export const fetchAll = (pageable, sort, filter) => dispatch => {
  dispatch(fetchAllRequest());

  const config = {
    url: `${RESOURCE_URL}/search/findAllByUsernameContaining`,
    params: {
      page: pageable.page,
      size: pageable.size,
      sort: `${sort.sortColumn},${sort.sortDirection}`,
      username: filter.username
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const users = getUsersFromResponseData(data);

      dispatch(fetchAllSuccess(users));

      return {
        users,
        page: data.page
      };
    })
    .catch(error => {
      dispatch(fetchAllFailure(error));
      throw error;
    });
};


export const createRequest = createAction(CREATE_REQUEST);
export const createSuccess = createAction(CREATE_SUCCESS);
export const createFailure = createAction(CREATE_FAILURE);

export const create = credentials => dispatch => {
  dispatch(createRequest());

  const config = {
    url: RESOURCE_URL,
    method: 'post',
    data: window.JSON.stringify(credentials),
    successStatus: 201
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const user = new PathUser(data);
      dispatch(createSuccess(user));
      return user;
    })
    .catch(error => {
      dispatch(createFailure(error));
      throw error;
    });
};


export const changeRequest = createAction(CHANGE_REQUEST);
export const changeSuccess = createAction(CHANGE_SUCCESS);
export const changeFailure = createAction(CHANGE_FAILURE);

export const change = (user, { password, roles, driveStyle }) => dispatch => {
  const requestData = {};

  if (password) {
    requestData.password = password;
  }

  if (roles) {
    requestData.roles = roles;
  }

  if (driveStyle) {
    requestData.driveStyle = driveStyle;
  }

  dispatch(changeRequest(user));

  const config = {
    url: `${RESOURCE_URL}/${user.id}`,
    method: 'patch',
    data: window.JSON.stringify(requestData)
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const user = new PathUser(data);

      dispatch(changeSuccess(user));

      if (password) {
        dispatch(storeData(LOGIN_ITEM_NAME,
          Buffer.from(user.username + ':' + password.trim(), 'ascii')
            .toString('base64')));
      }

      return user;
    })
    .catch(error => {
      dispatch(changeFailure(error));
      throw error;
    });
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createAction(REMOVE_SUCCESS);
const removeFailure = createAction(REMOVE_FAILURE);

export const remove = user => dispatch => {
  dispatch(removeRequest());

  const config = {
    url: `${RESOURCE_URL}/${user.id}`,
    method: 'delete',
    successStatus: 204
  };

  return dispatch(fetchApi(config))
    .then(() => dispatch(removeSuccess()))
    .catch(error => {
      dispatch(removeFailure(error));
      throw error;
    });
};


const addCarRequest = createAction(ADD_CAR_REQUEST);
const addCarSuccess = createAction(ADD_CAR_SUCCESS);
const addCarFailure = createAction(ADD_CAR_FAILURE);

export const addCar = (user, car) => dispatch => {
  dispatch(addCarRequest());

  const config = {
    url: `${RESOURCE_URL}/${user.id}/ownCars`,
    method: 'post',
    headers: {
      'Content-Type': 'text/uri-list'
    },
    successStatus: 204,
    data: car.self
  };

  return dispatch(fetchApi(config))
    .then(() => dispatch(addCarSuccess()))
    .catch(error => {
      dispatch(addCarFailure(error));
      throw error;
    });
};


const removeCarRequest = createAction(REMOVE_CAR_REQUEST);
const removeCarSuccess = createAction(REMOVE_CAR_SUCCESS);
const removeCarFailure = createAction(REMOVE_CAR_FAILURE);

export const removeCar = (user, car) => dispatch => {
  dispatch(removeCarRequest());

  const config = {
    url: `${RESOURCE_URL}/${user.id}/ownCars/${car.id}`,
    method: 'delete',
    successStatus: 204
  };

  return dispatch(fetchApi(config))
    .then(() => dispatch(removeCarSuccess()))
    .catch(error => {
      dispatch(removeCarFailure(error));
      throw error;
    });
};
