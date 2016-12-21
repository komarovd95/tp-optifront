import React from 'react';
import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { INFO } from '../../notifications/constants';
import { fetchOne, fetchAll, fetchCache, create, change, remove } from '../brands';
import { cachePut, getCache } from '../../cache';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { showModal } from '../../modal/modal';


const FETCH_REQUEST  = 'brands/edit/FETCH_REQUEST';
const FETCH_SUCCESS  = 'brands/edit/FETCH_SUCCESS';
const FETCH_FAILURE  = 'brands/edit/FETCH_FAILURE';

const SAVE_REQUEST   = 'brands/edit/SAVE_REQUEST';
const SAVE_SUCCESS   = 'brands/edit/SAVE_SUCCESS';
const SAVE_FAILURE   = 'brands/edit/SAVE_FAILURE';

const CHECK_REQUEST  = 'brands/edit/CHECK_REQUEST';
const CHECK_SUCCESS  = 'brands/edit/CHECK_SUCCESS';
const CHECK_FAILURE  = 'brands/edit/CHECK_FAILURE';

const DELETE_REQUEST = 'brands/edit/DELETE_REQUEST';
const DELETE_SUCCESS = 'brands/edit/DELETE_SUCCESS';
const DELETE_FAILURE = 'brands/edit/DELETE_FAILURE';


const initialState = {
  brand: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        brand: action.payload
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
      .then(brand => {
        dispatch(fetchSuccess(brand));
        return brand;
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

const brandsCache = getCache('brands');

export const save = (id, values) => (dispatch, getState) => {
  dispatch(saveRequest());

  const requestData = {
    brandName: values.brandName
  };

  const state = getState();

  if (id === 'new') {
    return dispatch(create(requestData))
      .then(() => dispatch(saveSuccess({
        message: 'Новая марка успешно создана!',
        notifyGlobal: true,
        level: INFO
      })))
      .catch(() => dispatch(saveFailure({
        message: 'Во время создания марки произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })));
  } else if (id) {
    const brand = state.brands.edit.brand;

    return dispatch(change(brand, requestData))
      .then(() => {
        dispatch(saveSuccess({
            message: `Марка успешно изменена!`,
            notifyGlobal: true,
            level: INFO
        }));
      })
      .catch(() => dispatch(saveFailure({
        message: 'Во время изменения марки произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })))
      .then(() => {
        const cache = brandsCache(state);

        if (cache) {
          return dispatch(fetchCache());
        }
      })
      .then(brands => {
        if (brands) {
          dispatch(cachePut({
            key: 'brands',
            value: brands
          }));
        }
      })
      .catch(() => {});
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
    sortColumn: 'brandName',
    sortDirection: 'ASC'
  };

  const filter = {
    brandName: values.brandName
  };

  return dispatch(fetchAll(page, sort, filter))
    .then(({ brands }) => {
      dispatch(checkSuccess());

      if (brands) {
        const brand = mapNormalized(brands)
          .find(b => b.brandName.toUpperCase() === values.brandName.toUpperCase());

        if (brand) {
          const message = [`Такая марка уже существует`];

          throw {
            brandName: message,
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

export const deleteBrand = () => (dispatch, getState) => {
  dispatch(deleteRequest());

  const brand = getState().brands.edit.brand;

  return dispatch(remove(brand))
    .then(() => dispatch(deleteSuccess({
      message: `Марка ${brand.brandName} успешно удалена!`,
      level: INFO,
      notifyGlobal: true
    })))
    .catch(() => dispatch(deleteFailure({
      message: 'Ошибка при удалении марки',
      notifyGlobal: true
    })));
};


export const showDeleteModal = () => (dispatch, getState) => {
  const brand = getState().brands.edit.brand;

  dispatch(showModal({
    title: 'Удалить марку',
    message: (
      <p>Вы действительно желаете удалить марку
        <b> {brand.brandName}</b> (Все автомобили данной марки также будут удалены)?
      </p>
    ),
    accept: () => dispatch(deleteBrand()).then(() => browserHistory.goBack())
  }));
};
