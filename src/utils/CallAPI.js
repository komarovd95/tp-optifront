import axios from 'axios';
import merge from 'lodash/merge';
import {createAction} from 'redux-actions';
import {browserHistory} from 'react-router';


const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:8080/' : 'http://localhost:3000/external/',
  timeout: 5000
});

export const get = (urlString, config = {}) => axiosInstance.get(urlString, config);

export const post = (urlString, data, config = {}) => axiosInstance.post(urlString, data, config);


export const FETCH_REQUEST = 'api/FETCH_REQUEST';
export const FETCH_SUCCESS = 'api/FETCH_SUCCESS';
export const FETCH_FAILURE = 'api/FETCH_FAILURE';

const fetchRequest = createAction(FETCH_REQUEST);
const fetchSuccess = createAction(FETCH_SUCCESS);
const fetchFailure = createAction(FETCH_FAILURE);

const DEFAULT_CONFIG = {
  url: '/',
  method: 'get',
  params: {},
  data: {},
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  successStatus: 200,
  redirectOn302: true,
  redirectOn404: true
};

export const fetchApi = config => dispatch => {
  const requestConfig = merge({}, DEFAULT_CONFIG, config);

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
        const {response} = error;

        dispatch(fetchFailure(response));

        if (response.status === 302 && requestConfig.redirectOn302) {
          browserHistory.replace('/signin');
        }

        if (response.status === 404 && requestConfig.redirectOn404) {
          browserHistory.replace('/404');
        }

        throw error.response;
      } else {
        dispatch(fetchFailure(error));
        throw error;
      }
    });
};


export const STORE_DATA_START = 'api/STORE_DATA_START';
export const STORE_DATA_END   = 'api/STORE_DATA_END';

const storeDataStart = createAction(STORE_DATA_START);
const storeDataEnd   = createAction(STORE_DATA_END);

export const storeData = (dataKey, dataToStore) => (dispatch) => {
  dispatch(storeDataStart());
  return new Promise((resolve, reject) => {
    if (window && window.localStorage) {
      const data = window.JSON.stringify(dataToStore);
      window.localStorage.setItem(dataKey, data);
      resolve(data);
    } else {
      reject({
        key: dataKey,
        data: dataToStore
      });
    }
  }).then(data => {
    dispatch(storeDataEnd());
    return data;
  }).catch(error => {
    dispatch(storeDataEnd());
    throw error;
  });
};


export const RETRIEVE_DATA_START = 'api/RETRIEVE_DATA_START';
export const RETRIEVE_DATA_END   = 'api/RETRIEVE_DATA_END';

const retrieveDataStart = createAction(RETRIEVE_DATA_START);
const retrieveDataEnd   = createAction(RETRIEVE_DATA_END);

export const retrieveData = (dataKey) => (dispatch) => {
  dispatch(retrieveDataStart());
  return new Promise((resolve, reject) => {
    if (window && window.localStorage) {
      const data = window.localStorage.getItem(dataKey);
      if (data) {
        resolve(window.JSON.parse(data));
      } else {
        reject({
          key: dataKey
        });
      }
    } else {
      reject({
        key: dataKey
      });
    }
  }).then(data => {
    dispatch(retrieveDataEnd());
    return data;
  }).catch(error => {
    dispatch(retrieveDataEnd());
    throw error;
  });
};


export const REMOVE_STORED_DATA = 'api/REMOVE_STORED_DATA';

const removeData = createAction(REMOVE_STORED_DATA);

export const removeStoredData = (dataKey) => (dispatch) => {
  return new Promise(resolve => {
    dispatch(removeData(dataKey));

    if (window && window.localStorage) {
      window.localStorage.removeItem(dataKey);
    }

    resolve();
  });
};


export class Pageable {
  constructor(page, size, totalPages, totalElements) {
    this.page = page;
    this.size = size;
    this.totalPages = totalPages;
    this.totalElements = totalElements;

    this.mergeWith = this.mergeWith.bind(this);
    this.toRequestData = this.toRequestData.bind(this);
  }

  mergeWith({page, number, size, totalPages, totalElements} = {}) {
    const obj = {};

    if (page || page === 0) {
      obj.page = page;
    } else if (number || number === 0) {
      obj.page = number;
    } else {
      obj.page = this.page;
    }

    if (size) {
      obj.size = size;
    } else {
      obj.size = this.size;
    }

    if (totalPages || totalPages === 0) {
      obj.totalPages = totalPages;
    } else {
      obj.totalPages = this.totalPages;
    }

    if (totalElements || totalElements === 0) {
      obj.totalElements = totalElements;
    } else {
      obj.totalElements = this.totalElements;
    }

    return new Pageable(obj.page, obj.size, obj.totalPages, obj.totalElements);
  }

  toRequestData() {
    return {
      page: this.page,
      size: this.size
    };
  }
}


export const ASC  = 'ASC';
export const DESC = 'DESC';
export const NONE = ASC;

export class Sort {
  constructor(sortColumn, sortDirection = NONE) {
    this.sortColumn = sortColumn;
    this.sortDirection = sortDirection;

    this.mergeWith = this.mergeWith.bind(this);
    this.toRequestData = this.toRequestData.bind(this);
  }

  mergeWith({sortColumn, sortDirection} = {}) {
    const obj = {};

    if (sortColumn) {
      obj.sortColumn = sortColumn;
    } else {
      obj.sortColumn = this.sortColumn;
    }

    if (sortDirection) {
      obj.sortDirection = sortDirection;
    } else {
      obj.sortDirection = this.sortDirection;
    }

    return new Sort(obj.sortColumn, obj.sortDirection);
  }

  toRequestData() {
    return `${this.sortColumn},${this.sortDirection}`;
  }
}


export class PageRequest {
  constructor(pageable, sortObjects, filterObject) {
    const {page, size} = pageable.toRequestData();

    this.page = page;
    this.size = size;

    this.sort = sortObjects.map(obj => obj.toRequestData());

    for (let [k, v] of Object.entries(filterObject)) {
      this[k] = v;
    }
  }
}

export const toPageRequest = (page, sort, filter, includeFalsey = true) => {
  const pageRequest = {};

  if (page) {
    const {page: p, size: s} = page.toRequestData();

    pageRequest.page = p;
    pageRequest.size = s;
  }

  if (sort instanceof Array) {
    pageRequest.sort = sort.map(s => s.toRequestData());
  } else if (sort) {
    pageRequest.sort = sort.toRequestData();
  }

  if (filter) {
    for (let [k, v] of Object.entries(filter)) {
      if (v || (includeFalsey && (v === '' || v === 0))) {
        pageRequest[k] = v;
      }
    }
  }

  return pageRequest;
};
