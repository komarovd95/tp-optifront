import { createAction } from 'redux-actions';
import { RESOURCE_URL } from './constants';
import { fetchApi } from '../api';
import { Street, getStreetsFromResponseData } from './model';


const FETCH_ONE_REQUEST   = 'streets/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS   = 'streets/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE   = 'streets/FETCH_ONE_FAILURE';

const FETCH_ALL_REQUEST   = 'streets/FETCH_ALL_REQUEST';
const FETCH_ALL_SUCCESS   = 'streets/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE   = 'streets/FETCH_ALL_FAILURE';

const FETCH_CACHE_REQUEST = 'streets/FETCH_CACHE_REQUEST';
const FETCH_CACHE_SUCCESS = 'streets/FETCH_CACHE_SUCCESS';
const FETCH_CACHE_FAILURE = 'streets/FETCH_CACHE_FAILURE';

const FETCH_TYPES_CACHE_REQUEST = 'streets/FETCH_TYPES_CACHE_REQUEST';
const FETCH_TYPES_CACHE_SUCCESS = 'streets/FETCH_TYPES_CACHE_SUCCESS';
const FETCH_TYPES_CACHE_FAILURE = 'streets/FETCH_TYPES_CACHE_FAILURE';

const CREATE_REQUEST      = 'streets/CREATE_REQUEST';
const CREATE_SUCCESS      = 'streets/CREATE_SUCCESS';
const CREATE_FAILURE      = 'streets/CREATE_FAILURE';

const CHANGE_REQUEST      = 'streets/CHANGE_REQUEST';
const CHANGE_SUCCESS      = 'streets/CHANGE_SUCCESS';
const CHANGE_FAILURE      = 'streets/CHANGE_FAILURE';

const REMOVE_REQUEST      = 'streets/REMOVE_REQUEST';
const REMOVE_SUCCESS      = 'streets/REMOVE_SUCCESS';
const REMOVE_FAILURE      = 'streets/REMOVE_FAILURE';


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
      const street = new Street(data);
      dispatch(fetchOneSuccess(street));
      return street;
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
    url: RESOURCE_URL,
    params: {
      page: pageable.page,
      size: pageable.size,
      sort: `${sort.sortColumn},${sort.sortDirection}`,
      ...filter
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const streets = getStreetsFromResponseData(data);
      dispatch(fetchAllSuccess(streets));

      return {
        streets,
        page: data.page
      };
    })
    .catch(error => {
      dispatch(fetchAllFailure(error));
      throw error;
    });
};


export const fetchCacheRequest = createAction(FETCH_CACHE_REQUEST);
export const fetchCacheSuccess = createAction(FETCH_CACHE_SUCCESS);
export const fetchCacheFailure = createAction(FETCH_CACHE_FAILURE);

export const fetchCache = () => dispatch => {
  dispatch(fetchCacheRequest());

  const config = {
    url: RESOURCE_URL
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const streets = getStreetsFromResponseData(data);
      dispatch(fetchCacheSuccess(streets));
      return streets;
    })
    .catch(error => {
      dispatch(fetchCacheFailure(error));
      throw error;
    });
};


export const fetchTypesCacheRequest = createAction(FETCH_TYPES_CACHE_REQUEST);
export const fetchTypesCacheSuccess = createAction(FETCH_TYPES_CACHE_SUCCESS);
export const fetchTypesCacheFailure = createAction(FETCH_TYPES_CACHE_FAILURE);

export const fetchTypesCache = () => dispatch => {
  dispatch(fetchTypesCacheRequest());

  const config = {
    url: `${RESOURCE_URL}/types`
  };

  return dispatch(fetchApi(config))
    .then(data => {
      dispatch(fetchTypesCacheSuccess(data));
      return data;
    })
    .catch(error => {
      dispatch(fetchTypesCacheFailure(error));
      throw error;
    });
};


export const createRequest = createAction(CREATE_REQUEST);
export const createSuccess = createAction(CREATE_SUCCESS);
export const createFailure = createAction(CREATE_FAILURE);

export const create = values => dispatch => {
  dispatch(createRequest());

  const config = {
    url: RESOURCE_URL,
    method: 'post',
    data: window.JSON.stringify(values),
    successStatus: 201
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const street = new Street(data);
      dispatch(createSuccess(street));
      return street;
    })
    .catch(error => {
      dispatch(createFailure(error));
      throw error;
    });
};


export const changeRequest = createAction(CHANGE_REQUEST);
export const changeSuccess = createAction(CHANGE_SUCCESS);
export const changeFailure = createAction(CHANGE_FAILURE);

export const change = (street, { streetName, streetType }) => dispatch => {
  const requestData = {};

  if (streetName) {
    requestData.streetName = streetName;
    requestData.streetType = streetType;
  }

  dispatch(changeRequest(street));

  const config = {
    url: `${RESOURCE_URL}/${street.id}`,
    method: 'patch',
    data: window.JSON.stringify(requestData)
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const street = new Street(data);
      dispatch(changeSuccess(street));
      return street;
    })
    .catch(error => {
      dispatch(changeFailure(error));
      throw error;
    });
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createAction(REMOVE_SUCCESS);
const removeFailure = createAction(REMOVE_FAILURE);

export const remove = street => dispatch => {
  dispatch(removeRequest());

  const config = {
    url: `${RESOURCE_URL}/${street.id}`,
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
