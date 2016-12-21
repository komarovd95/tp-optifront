import React from 'react';
import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { INFO } from '../../notifications/constants';
import { fetchOne, fetchAll, fetchCache, create, change, remove } from '../coverTypes';
import { cachePut, getCache } from '../../cache';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { showModal } from '../../modal/modal';


const FETCH_REQUEST  = 'coverTypes/edit/FETCH_REQUEST';
const FETCH_SUCCESS  = 'coverTypes/edit/FETCH_SUCCESS';
const FETCH_FAILURE  = 'coverTypes/edit/FETCH_FAILURE';

const SAVE_REQUEST   = 'coverTypes/edit/SAVE_REQUEST';
const SAVE_SUCCESS   = 'coverTypes/edit/SAVE_SUCCESS';
const SAVE_FAILURE   = 'coverTypes/edit/SAVE_FAILURE';

const CHECK_REQUEST  = 'coverTypes/edit/CHECK_REQUEST';
const CHECK_SUCCESS  = 'coverTypes/edit/CHECK_SUCCESS';
const CHECK_FAILURE  = 'coverTypes/edit/CHECK_FAILURE';

const DELETE_REQUEST = 'coverTypes/edit/DELETE_REQUEST';
const DELETE_SUCCESS = 'coverTypes/edit/DELETE_SUCCESS';
const DELETE_FAILURE = 'coverTypes/edit/DELETE_FAILURE';


const initialState = {
  coverType: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        coverType: action.payload
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
      .then(coverType => {
        dispatch(fetchSuccess(coverType));
        return coverType;
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

const coverTypesCache = getCache('coverTypes');

export const save = (id, values) => (dispatch, getState) => {
  dispatch(saveRequest());

  const requestData = {
    coverTypeName: values.coverTypeName,
    slowdown: values.slowdown
  };

  const state = getState();

  if (id === 'new') {
    return dispatch(create(requestData))
      .then(() => dispatch(saveSuccess({
        message: 'Новый тип покрытия успешно создан!',
        notifyGlobal: true,
        level: INFO
      })))
      .catch(() => dispatch(saveFailure({
        message: 'Во время создания типа покрытия произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })));
  } else if (id) {
    const coverType = state.coverTypes.edit.coverType;

    return dispatch(change(coverType, requestData))
      .then(() => {
        dispatch(saveSuccess({
            message: `Тип покрытия успешно изменен!`,
            notifyGlobal: true,
            level: INFO
        }));
      })
      .catch(() => dispatch(saveFailure({
        message: 'Во время изменения типа покрытия произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      })))
      .then(() => {
        const cache = coverTypesCache(state);

        if (cache) {
          return dispatch(fetchCache());
        }
      })
      .then(coverTypes => {
        if (coverTypes) {
          dispatch(cachePut({
            key: 'coverTypes',
            value: coverTypes
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
    sortColumn: 'coverTypeName',
    sortDirection: 'ASC'
  };

  const filter = {
    coverTypeName: values.coverTypeName
  };

  return dispatch(fetchAll(page, sort, filter))
    .then(({ coverTypes }) => {
      dispatch(checkSuccess());

      if (coverTypes) {
        const coverType = mapNormalized(coverTypes)
          .find(b => b.coverTypeName.toUpperCase() === values.coverTypeName.toUpperCase());

        if (coverType && coverType.id !== values.id) {
          const message = [`Такой тип покрытия уже существует`];

          throw {
            coverTypeName: message,
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

export const deleteCoverType = () => (dispatch, getState) => {
  dispatch(deleteRequest());

  const coverType = getState().coverTypes.edit.coverType;

  return dispatch(remove(coverType))
    .then(() => dispatch(deleteSuccess({
      message: `Тип покрытия ${coverType.coverTypeName} успешно удален!`,
      level: INFO,
      notifyGlobal: true
    })))
    .catch(() => dispatch(deleteFailure({
      message: 'Ошибка при удалении типа покрытия',
      notifyGlobal: true
    })));
};


export const showDeleteModal = () => (dispatch, getState) => {
  const coverType = getState().coverTypes.edit.coverType;

  dispatch(showModal({
    title: 'Удалить тип покрытия',
    message: (
      <p>Вы действительно желаете удалить тип покрытия
        <b> {coverType.coverTypeName}</b>?
      </p>
    ),
    accept: () => dispatch(deleteCoverType()).then(() => browserHistory.goBack())
  }));
};
