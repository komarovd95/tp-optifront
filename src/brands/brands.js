import { createAction } from 'redux-actions';
import { RESOURCE_URL } from './constants';
import { fetchApi } from '../api';
import { CarBrand, getBrandsFromResponseData } from './model';


const FETCH_ONE_REQUEST = 'brands/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS = 'brands/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE = 'brands/FETCH_ONE_FAILURE';

const FETCH_ALL_REQUEST = 'brands/FETCH_ALL_REQUEST';
const FETCH_ALL_SUCCESS = 'brands/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'brands/FETCH_ALL_FAILURE';

const FETCH_CACHE_REQUEST = 'brands/FETCH_CACHE_REQUEST';
const FETCH_CACHE_SUCCESS = 'brands/FETCH_CACHE_SUCCESS';
const FETCH_CACHE_FAILURE = 'brands/FETCH_CACHE_FAILURE';

const CREATE_REQUEST    = 'brands/CREATE_REQUEST';
const CREATE_SUCCESS    = 'brands/CREATE_SUCCESS';
const CREATE_FAILURE    = 'brands/CREATE_FAILURE';

const CHANGE_REQUEST    = 'brands/CHANGE_REQUEST';
const CHANGE_SUCCESS    = 'brands/CHANGE_SUCCESS';
const CHANGE_FAILURE    = 'brands/CHANGE_FAILURE';

const REMOVE_REQUEST    = 'brands/REMOVE_REQUEST';
const REMOVE_SUCCESS    = 'brands/REMOVE_SUCCESS';
const REMOVE_FAILURE    = 'brands/REMOVE_FAILURE';


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
      const brand = new CarBrand(data);
      dispatch(fetchOneSuccess(brand));
      return brand;
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
    url: `${RESOURCE_URL}/search/findAllByBrandNameContainingIgnoreCase`,
    params: {
      page: pageable.page,
      size: pageable.size,
      sort: `${sort.sortColumn},${sort.sortDirection}`,
      ...filter
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const brands = getBrandsFromResponseData(data);
      dispatch(fetchAllSuccess(brands));

      return {
        brands,
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
      const brands = getBrandsFromResponseData(data);
      dispatch(fetchCacheSuccess(brands));
      return brands;
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
      const brand = new CarBrand(data);
      dispatch(createSuccess(brand));
      return brand;
    })
    .catch(error => {
      dispatch(createFailure(error));
      throw error;
    });
};


export const changeRequest = createAction(CHANGE_REQUEST);
export const changeSuccess = createAction(CHANGE_SUCCESS);
export const changeFailure = createAction(CHANGE_FAILURE);

export const change = (brand, { brandName }) => dispatch => {
  const requestData = {};

  if (brandName) {
    requestData.brandName = brandName;
  }

  dispatch(changeRequest(brand));

  const config = {
    url: `${RESOURCE_URL}/${brand.id}`,
    method: 'patch',
    data: window.JSON.stringify(requestData)
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const brand = new CarBrand(data);
      dispatch(changeSuccess(brand));
      return brand;
    })
    .catch(error => {
      dispatch(changeFailure(error));
      throw error;
    });
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createAction(REMOVE_SUCCESS);
const removeFailure = createAction(REMOVE_FAILURE);

export const remove = brand => dispatch => {
  dispatch(removeRequest());

  const config = {
    url: `${RESOURCE_URL}/${brand.id}`,
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
