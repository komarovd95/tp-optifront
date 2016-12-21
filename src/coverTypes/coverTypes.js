import { createAction } from 'redux-actions';
import { RESOURCE_URL } from './constants';
import { fetchApi } from '../api';
import { CoverType, getCoverTypesFromResponseData } from './model';


const FETCH_ONE_REQUEST   = 'coverTypes/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS   = 'coverTypes/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE   = 'coverTypes/FETCH_ONE_FAILURE';

const FETCH_ALL_REQUEST   = 'coverTypes/FETCH_ALL_REQUEST';
const FETCH_ALL_SUCCESS   = 'coverTypes/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE   = 'coverTypes/FETCH_ALL_FAILURE';

const FETCH_CACHE_REQUEST = 'coverTypes/FETCH_CACHE_REQUEST';
const FETCH_CACHE_SUCCESS = 'coverTypes/FETCH_CACHE_SUCCESS';
const FETCH_CACHE_FAILURE = 'coverTypes/FETCH_CACHE_FAILURE';

const CREATE_REQUEST      = 'coverTypes/CREATE_REQUEST';
const CREATE_SUCCESS      = 'coverTypes/CREATE_SUCCESS';
const CREATE_FAILURE      = 'coverTypes/CREATE_FAILURE';

const CHANGE_REQUEST      = 'coverTypes/CHANGE_REQUEST';
const CHANGE_SUCCESS      = 'coverTypes/CHANGE_SUCCESS';
const CHANGE_FAILURE      = 'coverTypes/CHANGE_FAILURE';

const REMOVE_REQUEST      = 'coverTypes/REMOVE_REQUEST';
const REMOVE_SUCCESS      = 'coverTypes/REMOVE_SUCCESS';
const REMOVE_FAILURE      = 'coverTypes/REMOVE_FAILURE';


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
      const coverType = new CoverType(data);
      dispatch(fetchOneSuccess(coverType));
      return coverType;
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
      const coverTypes = getCoverTypesFromResponseData(data);
      dispatch(fetchAllSuccess(coverTypes));

      return {
        coverTypes,
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
      const coverTypes = getCoverTypesFromResponseData(data);
      dispatch(fetchCacheSuccess(coverTypes));
      return coverTypes;
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
      const coverType = new CoverType(data);
      dispatch(createSuccess(coverType));
      return coverType;
    })
    .catch(error => {
      dispatch(createFailure(error));
      throw error;
    });
};


export const changeRequest = createAction(CHANGE_REQUEST);
export const changeSuccess = createAction(CHANGE_SUCCESS);
export const changeFailure = createAction(CHANGE_FAILURE);

export const change = (coverType, { coverTypeName, slowdown }) => dispatch => {
  const requestData = {};

  if (coverTypeName) {
    requestData.coverTypeName = coverTypeName;
    requestData.slowdown = slowdown;
  }

  dispatch(changeRequest(coverType));

  const config = {
    url: `${RESOURCE_URL}/${coverType.id}`,
    method: 'patch',
    data: window.JSON.stringify(requestData)
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const coverType = new CoverType(data);
      dispatch(changeSuccess(coverType));
      return coverType;
    })
    .catch(error => {
      dispatch(changeFailure(error));
      throw error;
    });
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createAction(REMOVE_SUCCESS);
const removeFailure = createAction(REMOVE_FAILURE);

export const remove = coverType => dispatch => {
  dispatch(removeRequest());

  const config = {
    url: `${RESOURCE_URL}/${coverType.id}`,
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
