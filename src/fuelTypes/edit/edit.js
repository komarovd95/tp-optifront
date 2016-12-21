import React from 'react';
import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { INFO } from '../../notifications/constants';
import { fetchOne, fetchAll, fetchCache, create, change, remove } from '../fuelTypes';
import { cachePut, getCache } from '../../cache';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { showModal } from '../../modal/modal';


const FETCH_REQUEST  = 'fuelTypes/edit/FETCH_REQUEST';
const FETCH_SUCCESS  = 'fuelTypes/edit/FETCH_SUCCESS';
const FETCH_FAILURE  = 'fuelTypes/edit/FETCH_FAILURE';

const SAVE_REQUEST   = 'fuelTypes/edit/SAVE_REQUEST';
const SAVE_SUCCESS   = 'fuelTypes/edit/SAVE_SUCCESS';
const SAVE_FAILURE   = 'fuelTypes/edit/SAVE_FAILURE';

const CHECK_REQUEST  = 'fuelTypes/edit/CHECK_REQUEST';
const CHECK_SUCCESS  = 'fuelTypes/edit/CHECK_SUCCESS';
const CHECK_FAILURE  = 'fuelTypes/edit/CHECK_FAILURE';

const DELETE_REQUEST = 'fuelTypes/edit/DELETE_REQUEST';
const DELETE_SUCCESS = 'fuelTypes/edit/DELETE_SUCCESS';
const DELETE_FAILURE = 'fuelTypes/edit/DELETE_FAILURE';


const initialState = {
  fuelType: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        fuelType: action.payload
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
      .then(fuelType => {
        dispatch(fetchSuccess(fuelType));
        return fuelType;
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

const fuelTypesCache = getCache('fuelTypes');

export const save = (id, values) => (dispatch, getState) => {
  dispatch(saveRequest());

  const requestData = {
    fuelTypeName: values.fuelTypeName,
    cost: values.cost
  };

  const state = getState();

  if (id === 'new') {
    return dispatch(create(requestData))
      .then(() => dispatch(saveSuccess({
        message: 'Новый тип топлива успешно создан!',
        notifyGlobal: true,
        level: INFO
      })))
      .catch(() => dispatch(saveFailure({
        message: 'Во время создания типа топлива произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })));
  } else if (id) {
    const fuelType = state.fuelTypes.edit.fuelType;

    return dispatch(change(fuelType, requestData))
      .then(() => {
        dispatch(saveSuccess({
            message: `Тип топлива успешно изменен!`,
            notifyGlobal: true,
            level: INFO
        }));
      })
      .catch(() => dispatch(saveFailure({
        message: 'Во время изменения типа топлива произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })))
      .then(() => {
        const cache = fuelTypesCache(state);

        if (cache) {
          return dispatch(fetchCache());
        }
      })
      .then(fuelTypes => {
        if (fuelTypes) {
          dispatch(cachePut({
            key: 'fuelTypes',
            value: fuelTypes
          }));
        }
      })
      .catch(error => console.log(error));
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
    sortColumn: 'fuelTypeName',
    sortDirection: 'ASC'
  };

  const filter = {
    fuelTypeName: values.fuelTypeName
  };

  return dispatch(fetchAll(page, sort, filter))
    .then(({ fuelTypes }) => {
      dispatch(checkSuccess());

      if (fuelTypes) {
        const fuelType = mapNormalized(fuelTypes)
          .find(b => b.fuelTypeName.toUpperCase() === values.fuelTypeName.toUpperCase());

        if (fuelType && fuelType.id !== values.id) {
          const message = [`Такой тип топлива уже существует`];

          throw {
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

export const deleteFuelType = () => (dispatch, getState) => {
  dispatch(deleteRequest());

  const fuelType = getState().fuelTypes.edit.fuelType;

  return dispatch(remove(fuelType))
    .then(() => dispatch(deleteSuccess({
      message: `Тип топлива ${fuelType.fuelTypeName} успешно удален!`,
      level: INFO,
      notifyGlobal: true
    })))
    .catch(() => dispatch(deleteFailure({
      message: 'Ошибка при удалении типа топлива',
      notifyGlobal: true
    })));
};


export const showDeleteModal = () => (dispatch, getState) => {
  const fuelType = getState().fuelTypes.edit.fuelType;

  dispatch(showModal({
    title: 'Удалить тип топлива',
    message: (
      <p>Вы действительно желаете удалить тип топлива
        <b> {fuelType.fuelTypeName}</b> (Все автомобили, использующие данный тип топлива также будут удалены)?
      </p>
    ),
    accept: () => dispatch(deleteFuelType()).then(() => browserHistory.goBack())
  }));
};
