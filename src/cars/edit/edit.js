import React from 'react';
import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { INFO } from '../../notifications/constants';
import { fetchOne, fetchAll, create, change, remove } from '../cars';
import { getCache } from '../../cache';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { showModal } from '../../modal/modal';


const FETCH_REQUEST = 'cars/edit/FETCH_REQUEST';
const FETCH_SUCCESS = 'cars/edit/FETCH_SUCCESS';
const FETCH_FAILURE = 'cars/edit/FETCH_FAILURE';

const SAVE_REQUEST  = 'cars/edit/SAVE_REQUEST';
const SAVE_SUCCESS  = 'cars/edit/SAVE_SUCCESS';
const SAVE_FAILURE  = 'cars/edit/SAVE_FAILURE';

const CHECK_REQUEST = 'cars/edit/CHECK_REQUEST';
const CHECK_SUCCESS = 'cars/edit/CHECK_SUCCESS';
const CHECK_FAILURE = 'cars/edit/CHECK_FAILURE';

const DELETE_REQUEST = 'cars/edit/DELETE_REQUEST';
const DELETE_SUCCESS = 'cars/edit/DELETE_SUCCESS';
const DELETE_FAILURE = 'cars/edit/DELETE_FAILURE';


const initialState = {
  isLoading: false,
  car: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case FETCH_SUCCESS:
      return {
        car: action.payload,
        isLoading: false
      };

    case FETCH_FAILURE:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
}


const fetchRequest = createAction(FETCH_REQUEST);
export const fetchSuccess = createAction(FETCH_SUCCESS);
const fetchFailure = createNotify(FETCH_FAILURE);

export const fetch = id => dispatch => {
  dispatch(fetchRequest());

  if (id === 'new') {
    return new Promise(resolve => {
      dispatch(fetchSuccess(null));
      resolve();
    });
  } else if (id && id.match(/^([0-9]+)$/)) {
    return dispatch(fetchOne(id))
      .then(car => {
        dispatch(fetchSuccess(car));
        return car;
      })
      .catch(() => dispatch(fetchFailure({
        message: 'Во время загрузки данных произошла ошибка. Попробуйте позже',
        notifyGlobal: true
      })));
  } else {
    return new Promise((resolve, reject) => {
      browserHistory.push('/404');
      reject();
    });
  }
};


const saveRequest = createAction(SAVE_REQUEST);
const saveSuccess = createNotify(SAVE_SUCCESS);
const saveFailure = createNotify(SAVE_FAILURE);

const getBrands    = getCache('brands');
const getFuelTypes = getCache('fuelTypes');

export const save = (id, values) => (dispatch, getState) => {
  dispatch(saveRequest());

  const requestData = {};

  requestData.name = values.name;
  requestData.fuelConsumption = values.fuelConsumption;
  requestData.maxVelocity = values.maxVelocity;

  const state = getState();

  const brands = getBrands(state);
  const fuelTypes = getFuelTypes(state);

  if (brands && fuelTypes) {
    const brand = mapNormalized(brands)
      .find(brand => brand.brandName === values.brandName);
    const fuelType = mapNormalized(fuelTypes)
      .find(fuelType => fuelType.fuelTypeName === values.fuelTypeName);

    if (brand && fuelType) {
      requestData.brand = brand.self;
      requestData.fuelType = fuelType.self;
    }
  }

  if (id === 'new') {
    return dispatch(create(requestData))
      .then(() => dispatch(saveSuccess({
        message: 'Автомобиль успешно создан!',
        notifyGlobal: true,
        level: INFO
      })))
      .catch(() => dispatch(saveFailure({
        message: 'Во время создания автомобиля произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })));
  } else if (id) {
    const car = state.cars.edit.car;

    return dispatch(change(car, requestData))
      .then(() => dispatch(saveSuccess({
        message: `Автомобиль ${car.brandName} ${car.name} (${car.fuelTypeName}) успешно изменен!`,
        notifyGlobal: true,
        level: INFO
      })))
      .catch(() => dispatch(saveFailure({
        message: 'Во время изменения автомобиля произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })));
  }
};


const checkRequest = createAction(CHECK_REQUEST);
const checkSuccess = createAction(CHECK_SUCCESS);
const checkFailure = createNotify(CHECK_FAILURE);

export const checkUniqueness = values => dispatch => {
  dispatch(checkRequest());

  const page = {
    page: 0,
    size: 1
  };

  const sort = {
    sortColumn: 'name',
    sortDirection: 'ASC'
  };

  const filter = {
    name: values.name,
    brand: values.brandName,
    fuelType: values.fuelTypeName
  };

  return dispatch(fetchAll(undefined, page, sort, filter))
    .then(({ cars }) => {
      dispatch(checkSuccess());
      if (cars && cars.result && cars.result.length > 0) {

        const car = Object.keys(cars.entities)
          .map(k => cars.entities[k])
          .find(c => c.name.toUpperCase() === values.name.toUpperCase());

        if (car) {
          const message = [`Такой автомобиль уже существует`];

          throw {
            name: message,
            brandName: message,
            fuelTypeName: message,
            _error: message
          };
        }
      }
    })
    .catch(error => {
      if (error.status) {
        dispatch(checkFailure({
          message: 'Ошибка на сервере. Попробуйте позже',
          notifyGlobal: true
        }));
      }

      throw error;
    });
};


const deleteRequest = createAction(DELETE_REQUEST);
const deleteSuccess = createNotify(DELETE_SUCCESS);
const deleteFailure = createNotify(DELETE_FAILURE);

export const deleteCar = () => (dispatch, getState) => {
  dispatch(deleteRequest());

  const car = getState().cars.edit.car;

  return dispatch(remove(car))
    .then(() => dispatch(deleteSuccess({
      message: `Автомобиль ${car.brandName} ${car.name} (${car.fuelTypeName}) успешно удален!`,
      level: INFO,
      notifyGlobal: true
    })))
    .catch(() => dispatch(deleteFailure({
      message: 'Ошибка при удалении автомобиля',
      notifyGlobal: true
    })));
};


export const showDeleteModal = () => (dispatch, getState) => {
  const car = getState().cars.edit.car;

  dispatch(showModal({
    title: 'Удалить автомобиль',
    message: (
      <p>Вы действительно желаете удалить автомобиль
        <b> {car.brandName} {car.name} ({car.fuelTypeName})</b>?
      </p>
    ),
    accept: () => dispatch(deleteCar()).then(() => browserHistory.goBack())
  }));
};

