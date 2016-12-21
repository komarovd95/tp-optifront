import axios from 'axios';
import merge from 'lodash/merge';
import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';


export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/' : '/external',
  timeout: 5000
});


export const FETCH_REQUEST = 'api/FETCH_REQUEST';
export const FETCH_SUCCESS = 'api/FETCH_SUCCESS';
export const FETCH_FAILURE = 'api/FETCH_FAILURE';

export const STORE_START   = 'api/STORE_START';
export const STORE_END     = 'api/STORE_END';

export const RETRIEVE_START = 'api/RETRIEVE_START';
export const RETRIEVE_END   = 'api/RETRIEVE_END';

export const REMOVE_STORED = 'api/REMOVE_STORED';


export const fetchRequest = createAction(FETCH_REQUEST);
export const fetchSuccess = createAction(FETCH_SUCCESS);
export const fetchFailure = createAction(FETCH_FAILURE);

const defaultConfig = {
  url: '/',
  method: 'get',
  params: null,
  data: null,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  successStatus: 200,
  redirectOn302: true,
  redirectOn404: true
};

export const fetchApi = config => dispatch => {
  const requestConfig = merge({}, defaultConfig, config);

  dispatch(fetchRequest());

  return axiosInstance.request(requestConfig)
    .then(response => {
      if (response.status === requestConfig.successStatus) {
        dispatch(fetchSuccess(response.data));
        return response.data;
      } else {
        dispatch(fetchFailure(response));
        return response;
      }
    })
    .catch(error => {
      if (error.response) {
        const { response } = error;

        dispatch(fetchFailure(response));

        if (response.status === 302 && requestConfig.redirectOn302) {
          browserHistory.push('/signin');
        }

        if (response.status === 404 && requestConfig.redirectOn404) {
          browserHistory.push('/404');
        }

        throw error.response;
      } else {
        dispatch(fetchFailure(error));

        throw error;
      }
    });
};


export const storeStart = createAction(STORE_START);
export const storeEnd   = createAction(STORE_END);

export const storeData = (key, data) => dispatch => {
  dispatch(storeStart());

  return new Promise((resolve, reject) => {
    if (window && window.localStorage) {
      const dataToStore = window.JSON.stringify(data);
      window.localStorage.setItem(key, dataToStore);
      resolve(data);
    } else {
      reject({ key, data });
    }
  }).then(storedData => {
    dispatch(storeEnd());
    return storedData;
  }).catch(error => {
    dispatch(storeEnd());
    throw error;
  });
};


export const retrieveStart = createAction(RETRIEVE_START);
export const retrieveEnd   = createAction(RETRIEVE_END);

export const retrieveData = key => dispatch => {
  dispatch(retrieveStart());

  return new Promise((resolve, reject) => {
    if (window && window.localStorage) {
      const data = window.localStorage.getItem(key);
      if (data) {
        resolve(window.JSON.parse(data));
      } else {
        reject({ key });
      }
    } else {
      reject({ key });
    }
  }).then(data => {
    dispatch(retrieveEnd());
    return data;
  }).catch(error => {
    dispatch(retrieveEnd());
    throw error;
  });
};


export const removeStoredData = createAction(REMOVE_STORED);

export const removeData = key => dispatch => {
  return new Promise(resolve => {
    dispatch(removeStoredData(key));

    if (window && window.localStorage) {
      window.localStorage.removeItem(key);
    }

    resolve();
  });
};
