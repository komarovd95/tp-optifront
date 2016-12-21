import { createAction } from 'redux-actions';
import { globalFetchEnd, globalFetchStart } from '../app/app';
import { RESOURCE_URL } from './constants';
import { fetchCache as fetchBrands } from '../brands/brands';
import { fetchCache as fetchFuelTypes } from '../fuelTypes/fuelTypes';
import { fetchApi } from '../api';
import { cachePut } from '../cache';
import { Car, getCarsFromResponseData } from './model';


const FETCH_ONE_REQUEST = 'cars/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS = 'cars/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE = 'cars/FETCH_ONE_FAILURE';

const FETCH_ALL_REQUEST = 'cars/FETCH_ALL_REQUEST';
const FETCH_ALL_SUCCESS = 'cars/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'cars/FETCH_ALL_FAILURE';

const FETCH_CACHES_REQUEST = 'cars/FETCH_CACHES_REQUEST';
const FETCH_CACHES_SUCCESS = 'cars/FETCH_CACHES_SUCCESS';
const FETCH_CACHES_FAILURE = 'cars/FETCH_CACHES_FAILURE';

const CREATE_REQUEST    = 'cars/CREATE_REQUEST';
const CREATE_SUCCESS    = 'cars/CREATE_SUCCESS';
const CREATE_FAILURE    = 'cars/CREATE_FAILURE';

const CHANGE_REQUEST    = 'cars/CHANGE_REQUEST';
const CHANGE_SUCCESS    = 'cars/CHANGE_SUCCESS';
const CHANGE_FAILURE    = 'cars/CHANGE_FAILURE';

const REMOVE_REQUEST    = 'cars/REMOVE_REQUEST';
const REMOVE_SUCCESS    = 'cars/REMOVE_SUCCESS';
const REMOVE_FAILURE    = 'cars/REMOVE_FAILURE';


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
      const car = new Car(data);
      dispatch(fetchOneSuccess(car));
      return car;
    })
    .catch(error => {
      dispatch(fetchOneFailure(error));
      throw error;
    });
};


export const fetchAllRequest = createAction(FETCH_ALL_REQUEST);
export const fetchAllSuccess = createAction(FETCH_ALL_SUCCESS);
export const fetchAllFailure = createAction(FETCH_ALL_FAILURE);

export const fetchAll = (owner, pageable, sort, filter) => dispatch => {
  dispatch(fetchAllRequest());

  const config = {
    url: `${RESOURCE_URL}/search/filter`,
    params: {
      ownerId: owner && owner.id,
      page: pageable.page,
      size: pageable.size,
      sort: `${sort.sortColumn},${sort.sortDirection}`,
      ...filter
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const cars = getCarsFromResponseData(data);

      dispatch(fetchAllSuccess(cars));

      return {
        cars,
        page: data.page
      };
    })
    .catch(error => {
      dispatch(fetchAllFailure(error));
      throw error;
    });
};


export const fetchCachesRequest = createAction(FETCH_CACHES_REQUEST);
export const fetchCachesSuccess = createAction(FETCH_CACHES_SUCCESS);
export const fetchCachesFailure = createAction(FETCH_CACHES_FAILURE);

export const fetchCaches = () => (dispatch, getState) => {
  dispatch(globalFetchStart({
    message: 'Загрузка данных....'
  }));
  dispatch(fetchCachesRequest());

  const { brands, fuelTypes } = getState().cache;

  if (brands && fuelTypes) {
    return new Promise(resolve => {
      const result = { brands, fuelTypes };
      dispatch(fetchCachesSuccess(result));
      dispatch(globalFetchEnd());
      resolve(result);
    });
  } else {

    const brandsFetch = dispatch(fetchBrands());
    const fuelTypesFetch = dispatch(fetchFuelTypes());

    return Promise.all([brandsFetch, fuelTypesFetch])
      .then(([fetchedBrands, fetchedFuelTypes]) => {
        dispatch(cachePut({
          key: 'brands',
          value: fetchedBrands
        }));

        dispatch(cachePut({
          key: 'fuelTypes',
          value: fetchedFuelTypes
        }));

        const result = {
          brands: fetchedBrands,
          fuelTypes: fetchedFuelTypes
        };

        dispatch(fetchCachesSuccess(result));
        dispatch(globalFetchEnd());

        return result;
      })
      .catch(error => {
        dispatch(fetchCachesFailure(error));
        dispatch(globalFetchEnd());
        throw error;
      });
  }
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
      const car = new Car(data);
      dispatch(createSuccess(car));
      return car;
    })
    .catch(error => {
      dispatch(createFailure(error));
      throw error;
    });
};


export const changeRequest = createAction(CHANGE_REQUEST);
export const changeSuccess = createAction(CHANGE_SUCCESS);
export const changeFailure = createAction(CHANGE_FAILURE);

export const change = (car, { fuelConsumption, maxVelocity }) => dispatch => {
  const requestData = {};

  if (fuelConsumption) {
    requestData.fuelConsumption = fuelConsumption;
  }

  if (maxVelocity) {
    requestData.maxVelocity = maxVelocity;
  }

  dispatch(changeRequest(car));

  const config = {
    url: `${RESOURCE_URL}/${car.id}`,
    method: 'patch',
    data: window.JSON.stringify(requestData)
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const car = new Car(data);
      dispatch(changeSuccess(car));
      return car;
    })
    .catch(error => {
      dispatch(changeFailure(error));
      throw error;
    });
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createAction(REMOVE_SUCCESS);
const removeFailure = createAction(REMOVE_FAILURE);

export const remove = car => dispatch => {
  dispatch(removeRequest());

  const config = {
    url: `${RESOURCE_URL}/${car.id}`,
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
