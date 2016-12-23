import { createAction } from 'redux-actions';
import { RESOURCE_URL } from './constants';
import { fetchApi } from '../api';
import { FuelType, getFuelTypesFromResponseData } from './model';


const FETCH_ONE_REQUEST   = 'fuelTypes/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS   = 'fuelTypes/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE   = 'fuelTypes/FETCH_ONE_FAILURE';

const FETCH_ALL_REQUEST   = 'fuelTypes/FETCH_ALL_REQUEST';
const FETCH_ALL_SUCCESS   = 'fuelTypes/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE   = 'fuelTypes/FETCH_ALL_FAILURE';

const FETCH_CACHE_REQUEST = 'fuelTypes/FETCH_CACHE_REQUEST';
const FETCH_CACHE_SUCCESS = 'fuelTypes/FETCH_CACHE_SUCCESS';
const FETCH_CACHE_FAILURE = 'fuelTypes/FETCH_CACHE_FAILURE';

const CREATE_REQUEST      = 'fuelTypes/CREATE_REQUEST';
const CREATE_SUCCESS      = 'fuelTypes/CREATE_SUCCESS';
const CREATE_FAILURE      = 'fuelTypes/CREATE_FAILURE';

const CHANGE_REQUEST      = 'fuelTypes/CHANGE_REQUEST';
const CHANGE_SUCCESS      = 'fuelTypes/CHANGE_SUCCESS';
const CHANGE_FAILURE      = 'fuelTypes/CHANGE_FAILURE';

const REMOVE_REQUEST      = 'fuelTypes/REMOVE_REQUEST';
const REMOVE_SUCCESS      = 'fuelTypes/REMOVE_SUCCESS';
const REMOVE_FAILURE      = 'fuelTypes/REMOVE_FAILURE';


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
      const fuelType = new FuelType(data);
      dispatch(fetchOneSuccess(fuelType));
      return fuelType;
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
    url: `${RESOURCE_URL}/search/findAllByFuelTypeNameContainingIgnoreCase`,
    params: {
      page: pageable.page,
      size: pageable.size,
      sort: `${sort.sortColumn},${sort.sortDirection}`,
      ...filter
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const fuelTypes = getFuelTypesFromResponseData(data);
      dispatch(fetchAllSuccess(fuelTypes));

      return {
        fuelTypes,
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
      const fuelTypes = getFuelTypesFromResponseData(data);
      dispatch(fetchCacheSuccess(fuelTypes));
      return fuelTypes;
    })
    .catch(error => {
      dispatch(fetchCacheFailure(error));
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
      const fuelType = new FuelType(data);
      dispatch(createSuccess(fuelType));
      return fuelType;
    })
    .catch(error => {
      dispatch(createFailure(error));
      throw error;
    });
};


export const changeRequest = createAction(CHANGE_REQUEST);
export const changeSuccess = createAction(CHANGE_SUCCESS);
export const changeFailure = createAction(CHANGE_FAILURE);

export const change = (fuelType, { fuelTypeName, cost }) => dispatch => {
  const requestData = {};

  if (fuelTypeName) {
    requestData.fuelTypeName = fuelTypeName;
  }

  if (cost) {
    requestData.cost = cost;
  }

  dispatch(changeRequest(fuelType));

  const config = {
    url: `${RESOURCE_URL}/${fuelType.id}`,
    method: 'patch',
    data: window.JSON.stringify(requestData)
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const fuelType = new FuelType(data);
      dispatch(changeSuccess(fuelType));
      return fuelType;
    })
    .catch(error => {
      dispatch(changeFailure(error));
      throw error;
    });
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createAction(REMOVE_SUCCESS);
const removeFailure = createAction(REMOVE_FAILURE);

export const remove = fuelType => dispatch => {
  dispatch(removeRequest());

  const config = {
    url: `${RESOURCE_URL}/${fuelType.id}`,
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
