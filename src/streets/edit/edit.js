import React from 'react';
import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { INFO } from '../../notifications/constants';
import { fetchOne, fetchAll, fetchCache, fetchTypesCache, create, change, remove } from '../streets';
import { cachePut, getCache } from '../../cache';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { showModal } from '../../modal/modal';
import { globalFetchStart, globalFetchEnd } from '../../app/app';


const FETCH_REQUEST  = 'streets/edit/FETCH_REQUEST';
const FETCH_SUCCESS  = 'streets/edit/FETCH_SUCCESS';
const FETCH_FAILURE  = 'streets/edit/FETCH_FAILURE';

const FETCH_TYPES_REQUEST  = 'streets/edit/FETCH_TYPES_REQUEST';
const FETCH_TYPES_SUCCESS  = 'streets/edit/FETCH_TYPES_SUCCESS';
const FETCH_TYPES_FAILURE  = 'streets/edit/FETCH_TYPES_FAILURE';

const SAVE_REQUEST   = 'streets/edit/SAVE_REQUEST';
const SAVE_SUCCESS   = 'streets/edit/SAVE_SUCCESS';
const SAVE_FAILURE   = 'streets/edit/SAVE_FAILURE';

const CHECK_REQUEST  = 'streets/edit/CHECK_REQUEST';
const CHECK_SUCCESS  = 'streets/edit/CHECK_SUCCESS';
const CHECK_FAILURE  = 'streets/edit/CHECK_FAILURE';

const DELETE_REQUEST = 'streets/edit/DELETE_REQUEST';
const DELETE_SUCCESS = 'streets/edit/DELETE_SUCCESS';
const DELETE_FAILURE = 'streets/edit/DELETE_FAILURE';


const initialState = {
  street: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        street: action.payload
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
      .then(street => {
        dispatch(fetchSuccess(street));
        return street;
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

const streetsCache = getCache('streets');

export const save = (id, values) => (dispatch, getState) => {
  dispatch(saveRequest());

  const requestData = {
    streetName: values.streetName,
    streetType: values.streetType
  };

  const state = getState();

  if (id === 'new') {
    return dispatch(create(requestData))
      .then(() => dispatch(saveSuccess({
        message: 'Новая улица успешно создана!',
        notifyGlobal: true,
        level: INFO
      })))
      .catch(() => dispatch(saveFailure({
        message: 'Во время создания улицы произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })));
  } else if (id) {
    const street = state.streets.edit.street;

    return dispatch(change(street, requestData))
      .then(() => {
        dispatch(saveSuccess({
            message: `Улица успешно изменена!`,
            notifyGlobal: true,
            level: INFO
        }));
      })
      .catch(() => dispatch(saveFailure({
        message: 'Во время изменения улицы произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })))
      .then(() => {
        const cache = streetsCache(state);

        if (cache) {
          return dispatch(fetchCache());
        }
      })
      .then(streets => {
        if (streets) {
          dispatch(cachePut({
            key: 'streets',
            value: streets
          }));
        }
      })
      .catch(error => console.log(error));
  }
};


const fetchTypesRequest = createAction(FETCH_TYPES_REQUEST);
const fetchTypesSuccess = createAction(FETCH_TYPES_SUCCESS);
const fetchTypesFailure = createNotify(FETCH_TYPES_FAILURE);

export const fetchTypes = () => (dispatch, getState) => {
  dispatch(globalFetchStart({
    message: 'Загрузка данных....'
  }));

  dispatch(fetchTypesRequest());

  const { streetTypes } = getState().cache;

  if (streetTypes) {
    return new Promise(resolve => {
      dispatch(fetchTypesSuccess(streetTypes));
      dispatch(globalFetchEnd());
      resolve(streetTypes);
    });
  } else {
    return dispatch(fetchTypesCache())
      .then(types => {
        dispatch(cachePut({
          key: 'streetTypes',
          value: types
        }));

        dispatch(fetchTypesSuccess(types));
        dispatch(globalFetchEnd());
        return types;
      })
      .catch(() => {
        dispatch(fetchTypesFailure({
          message: 'Во время загрузки данных произошла ошибка',
          notifyGlobal: true
        }));
        dispatch(globalFetchEnd());
      });
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
    sortColumn: 'streetName',
    sortDirection: 'ASC'
  };

  const filter = {
    streetName: values.streetName
  };

  return dispatch(fetchAll(page, sort, filter))
    .then(({ streets }) => {
      dispatch(checkSuccess());

      if (streets) {
        const street = mapNormalized(streets)
          .find(b => b.streetName.toUpperCase() === values.streetName.toUpperCase());

        if (street && street.id !== values.id) {
          const message = [`Такая улица уже существует`];

          throw {
            streetName: message,
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

export const deleteStreet = () => (dispatch, getState) => {
  dispatch(deleteRequest());

  const street = getState().streets.edit.street;

  return dispatch(remove(street))
    .then(() => dispatch(deleteSuccess({
      message: `Улица ${street.streetName} успешно удалена!`,
      level: INFO,
      notifyGlobal: true
    })))
    .catch(() => dispatch(deleteFailure({
      message: 'Ошибка при удалении улицы',
      notifyGlobal: true
    })));
};


export const showDeleteModal = () => (dispatch, getState) => {
  const street = getState().streets.edit.street;

  dispatch(showModal({
    title: 'Удалить тип покрытия',
    message: (
      <p>Вы действительно желаете удалить тип покрытия
        <b> {street.streetName}</b>?
      </p>
    ),
    accept: () => dispatch(deleteStreet()).then(() => browserHistory.goBack())
  }));
};
