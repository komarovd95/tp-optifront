import React from 'react';
import { createAction } from 'redux-actions';
import { combineReducers } from 'redux';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { globalFetchStart, globalFetchEnd } from '../../app/app';
import { retrieveData, removeData, fetchApi } from '../../api';
import { PathRoute, getRoutesFromResponseData } from '../model';
import { fetchOne, create, update, remove as removeApi } from '../routes';
import { fetchCache as fetchStreets } from '../../streets/streets';
import { fetchCache as fetchCoverTypes } from '../../coverTypes/coverTypes';
import { fetchCache as fetchFuelTypes } from '../../fuelTypes/fuelTypes';
import { RESOURCE_URL as CARS_URL } from '../../cars/constants';
import { getCarsFromResponseData } from '../../cars/model';
import { RESOURCE_URL } from '../constants';
import { cachePut } from '../../cache';
import Graph from 'node-dijkstra';

import manipulation, { init } from './manipulation';
import settings from './settings';
import path from './path';
import { showModal } from '../../modal/modal';



const STORAGE_ITEM = 'x-path-route';


const LOAD_REQUEST = 'routes/view/LOAD_REQUEST';
const LOAD_SUCCESS = 'routes/view/LOAD_SUCCESS';
const LOAD_FAILURE = 'routes/view/LOAD_FAILURE';

const SAVE_REQUEST = 'routes/view/SAVE_REQUEST';
const SAVE_SUCCESS = 'routes/view/SAVE_SUCCESS';
const SAVE_FAILURE = 'routes/view/SAVE_FAILURE';

const FETCH_CACHES_REQUEST = 'routes/view/FETCH_CACHES_REQUEST';
const FETCH_CACHES_SUCCESS = 'routes/view/FETCH_CACHES_SUCCESS';
const FETCH_CACHES_FAILURE = 'routes/view/FETCH_CACHES_FAILURE';

const FETCH_CARS_REQUEST   = 'routes/view/FETCH_CARS_REQUEST';
const FETCH_CARS_SUCCESS   = 'routes/view/FETCH_CARS_SUCCESS';
const FETCH_CARS_FAILURE   = 'routes/view/FETCH_CARS_FAILURE';

const SAVE_SETTINGS        = 'routes/view/SAVE_SETTINGS';

const UNIQUE_REQUEST       = 'routes/view/UNIQUE_REQUEST';
const UNIQUE_SUCCESS       = 'routes/view/UNIQUE_SUCCESS';
const UNIQUE_FAILURE       = 'routes/view/UNIQUE_FAILURE';

const REMOVE_REQUEST       = 'routes/view/REMOVE_REQUEST';
const REMOVE_SUCCESS       = 'routes/view/REMOVE_SUCCESS';
const REMOVE_FAILURE       = 'routes/view/REMOVE_FAILURE';


const defaultState = {
  fetched: null
};

const route = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      return {
        fetched: action.payload
      };

    default:
      return state;
  }
};


export default combineReducers({
  route,
  manipulation,
  settings,
  path
});


const loadRequest = createAction(LOAD_REQUEST);
const loadSuccess = createAction(LOAD_SUCCESS);
const loadFailure = createNotify(LOAD_FAILURE);

export const load = id => dispatch => {
  dispatch(globalFetchStart({
    message: 'Загрузка маршрута...'
  }));

  dispatch(loadRequest());

  if (id === 'example') {
    return new Promise(resolve => {
      dispatch(globalFetchEnd());
      dispatch(loadSuccess('EXAMPLE')); // TODO init
      resolve('EXAMPLE');
    });
  } else if (id === 'new') {
    return dispatch(retrieveData(STORAGE_ITEM))
      .then(data => new PathRoute(data))
      .catch(() => new PathRoute({
        name: '',
        nodes: [],
        edges: []
      }))
      .then(route => {
        dispatch(globalFetchEnd());
        dispatch(loadSuccess(route));
        dispatch(init({
          nodes: route.nodes.reduce((obj, node) => {
            obj[node.id] = node;
            return obj;
          }, {}),
          edges: route.edges.reduce((obj, edge) => {
            obj[edge.id] = edge;
            return obj;
          }, {})
        }));
        return route;
      })
      .catch(() => {
        dispatch(globalFetchEnd());
        dispatch(loadFailure({
          message: 'Во время загрузки маршрута произошла ошибка. Повторите запрос позже!',
          notifyGlobal: true
        }));

        throw new Error();
      });
  } else if (id && id.match(/^([0-9]+)$/)) {
    return dispatch(fetchOne(id))
      .then(route => {
        dispatch(globalFetchEnd());
        dispatch(loadSuccess(route));
        dispatch(init({
          nodes: route.nodes.reduce((obj, node) => {
            obj[node.id] = node;
            return obj;
          }, {}),
          edges: route.edges.reduce((obj, edge) => {
            obj[edge.id] = edge;
            return obj;
          }, {})
        }));
        return route;
      })
      .catch(() => {
        dispatch(globalFetchEnd());
        dispatch(loadFailure({
          message: 'Во время загрузки маршрута произошла ошибка. Попробуйте позже',
          notifyGlobal: true
        }));
      });
  } else {
    return new Promise((resolve, reject) => {
      browserHistory.push('/404');
      reject();
    });
  }
};


export const storeRoute = () => (dispatch, getState) => {
  const {manipulation: {present: {nodes, edges}}, route: {fetched: route}} = getState().routes.view;

  if (route && !route.id) {
    const data = {
      name: route.name,
      nodes: Object.keys(nodes).map(k => nodes[k]),
      edges: Object.keys(edges).map(k => edges[k])
    };

    if (window && window.localStorage) {
      const dataToStore = window.JSON.stringify(data);
      window.localStorage.setItem(STORAGE_ITEM, dataToStore);
    }
  }
};


const fetchCachesRequest = createAction(FETCH_CACHES_REQUEST);
const fetchCachesSuccess = createAction(FETCH_CACHES_SUCCESS);
const fetchCachesFailure = createNotify(FETCH_CACHES_FAILURE);

export const fetchCaches = () => (dispatch, getState) => {
  dispatch(globalFetchStart({
    message: 'Загрузка вспомогательных данных...'
  }));

  dispatch(fetchCachesRequest());

  const { streets, coverTypes, fuelTypes } = getState().cache;

  if (streets && coverTypes && fuelTypes) {
    return new Promise(resolve => {
      dispatch(globalFetchEnd());

      const result = { streets, coverTypes, fuelTypes };

      dispatch(fetchCachesSuccess(result));
      resolve(result);
    });
  } else {
    const streetsFetcher = dispatch(fetchStreets());
    const coverTypesFetcher = dispatch(fetchCoverTypes());
    const fuelTypesFetcher = dispatch(fetchFuelTypes());

    return Promise.all([streetsFetcher, coverTypesFetcher, fuelTypesFetcher])
      .then(([s, cT, fT]) => {
        dispatch(cachePut({
          key: 'streets',
          value: s
        }));

        dispatch(cachePut({
          key: 'coverTypes',
          value: cT
        }));

        dispatch(cachePut({
          key: 'fuelTypes',
          value: fT
        }));

        const result = { streets: s, coverTypes: cT, fuelTypes: fT };

        dispatch(fetchCachesSuccess(result));
        dispatch(globalFetchEnd());

        return result;
      })
      .catch(() => {
        dispatch(globalFetchEnd());
        dispatch(fetchCachesFailure({
          message: 'Ошибка при загрузке данных. Повторите запрос позже',
          notifyGlobal: true
        }));
      });
  }
};


const fetchCarsRequest = createAction(FETCH_CARS_REQUEST);
const fetchCarsSuccess = createAction(FETCH_CARS_SUCCESS);
const fetchCarsFailure = createNotify(FETCH_CARS_FAILURE);

export const fetchCars = () => (dispatch, getState) => {
  dispatch(globalFetchStart({
    message: 'Загрузка автомобилей...'
  }));

  dispatch(fetchCarsRequest());

  const { cars } = getState().cache;

  if (cars) {
    return new Promise(resolve => {
      dispatch(globalFetchEnd());
      dispatch(fetchCarsSuccess(cars));
      resolve(cars);
    });
  } else {
    return dispatch(fetchApi({ url: CARS_URL }))
      .then(data => {
        const cars = getCarsFromResponseData(data);

        dispatch(cachePut({
          key: 'cars',
          value: cars
        }));

        dispatch(fetchCarsSuccess(cars));
        dispatch(globalFetchEnd());

        return cars;
      })
      .catch(() => {
        dispatch(globalFetchEnd());
        dispatch(fetchCarsFailure({
          message: 'Ошибка при загрузке данных. Повторите запрос позже',
          notifyGlobal: true
        }));
      });
  }
};


const saveRequest = createAction(SAVE_REQUEST);
const saveSuccess = createNotify(SAVE_SUCCESS);
const saveFailure = createNotify(SAVE_FAILURE);

export const save = name => (dispatch, getState) => {
  dispatch(globalFetchStart({ message: 'Сохранение маршрута'}));
  dispatch(saveRequest());

  const {
    route: { fetched: route },
    manipulation: { present: { nodes, edges } }
  } = getState().routes.view;

  for (let key in edges) {
    if (!edges.hasOwnProperty(key)) {
      continue;
    }

    const { length, limit, coverType, street, traffic } = edges[key];

    if (!length || length < 100 || length > 50000) {
      dispatch(globalFetchEnd());
      dispatch(saveFailure({
        message: 'Длина участка дороги должна быть в пределах от 100 до 50000 м',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (!limit || limit < 20 || limit > 110) {
      dispatch(globalFetchEnd());
      dispatch(saveFailure({
        message: 'Ограничение скорости должно быть в пределах от 20 до 110 км/ч',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (!coverType) {
      dispatch(globalFetchEnd());
      dispatch(saveFailure({
        message: 'Укажите тип покрытия у каждого участка дороги',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (!street) {
      dispatch(globalFetchEnd());
      dispatch(saveFailure({
        message: 'Укажите название улицы у каждого участка дороги',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (traffic >= 0 && traffic > limit) {
      dispatch(globalFetchEnd());
      dispatch(saveFailure({
        message: 'Скорость движения в пробке не может быть больше, чем ограничение!',
        notifyGlobal: true
      }));
      return Promise.reject();
    }
  }

  for (let key in nodes) {
    if (!nodes.hasOwnProperty(key)) {
      continue;
    }

    const degree = Object.keys(edges).map(k => edges[k])
      .filter(edge => edge.from === key || edge.to === key).length;

    if (!degree) {
      dispatch(globalFetchEnd());
      dispatch(saveFailure({
        message: 'Найдены несоединенные вершины',
        notifyGlobal: true
      }));
      return Promise.reject();
    }
  }

  const owner = getState().auth.user;

  if (route.id) {
    return dispatch(update(route, name, nodes, edges))
      .then(route => {
        dispatch(globalFetchEnd());
        dispatch(loadSuccess(route));
        dispatch(saveSuccess({
          message: `Маршрут ${name} успешно сохранен`,
          notifyGlobal: true,
          level: 'INFO'
        }));
        return route;
      })
      .catch(() => {
        dispatch(globalFetchEnd());
        dispatch(saveFailure({
            message: 'Ошибка при сохранении маршрута',
            notifyGlobal: true
        }));
      });
  } else {
    return dispatch(create(owner, { name, nodes, edges }))
      .then(route => {
        dispatch(globalFetchEnd());
        dispatch(loadSuccess(route));
        dispatch(saveSuccess({
          message: `Маршрут ${name} успешно сохранен`,
          notifyGlobal: true,
          level: 'INFO'
        }));
        return route;
      })
      .catch(() => {
        dispatch(globalFetchEnd());
        dispatch(saveFailure({
            message: 'Ошибка при сохранении маршрута',
            notifyGlobal: true
        }));
      });
  }
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createNotify(REMOVE_SUCCESS);
const removeFailure = createNotify(REMOVE_FAILURE);

export const remove = () => (dispatch, getState) => {
  dispatch(removeRequest());

  const route = getState().routes.view.route.fetched;

  if (!route.id) {
    console.log('remove');
    dispatch(loadSuccess(new PathRoute({
      name: '',
      nodes: [],
      edges: []
    })));
    dispatch(init({
      nodes: {},
      edges: {}
    }));
    return dispatch(removeData(STORAGE_ITEM)).catch(() => {});
  }

  return dispatch(removeApi(route))
    .then(() => dispatch(removeSuccess({
      message: `Маршрут ${route.name} успешно удален!`,
      level: 'INFO',
      notifyGlobal: true
    })))
    .catch(() => dispatch(removeFailure({
      message: 'При удалении произошла ошибка, попробуйте позже',
      notifyGlobal: true
    })));
};


export const showDeleteModal = () => (dispatch, getState) => {
  const route = getState().routes.view.route.fetched;

  dispatch(showModal({
    title: 'Удалить маршрут',
    message: (
      <p>Вы действительно желаете удалить маршрут
        <b> {route.name}</b>?
      </p>
    ),
    accept: () => dispatch(remove()).then(() => route.id && browserHistory.push('/'))
  }));
};








const lengthFunction = e => e.length;
const velocityFunction = (e, car, node, user) => {
  if (e.traffic < e.limit) {
    return Math.min(e.traffic, car.maxVelocity);
  } else {
    if (user._driveStyle === 'LAW_ABIDING') {
      return Math.min(e.limit, car.maxVelocity);
    } else {
      return car.maxVelocity;
    }
  }
};
const wastedTimeFunction = (e, car, node) => (node.light) ? node.light.redPhase : 0;
const pauseTimeFunction = (e, car, node, user) => {
  if (e.policeman && user._driveStyle !== 'LAW_ABIDING') {
    return e.policeman.time;
  } else {
    return 0;
  }
};

const timeFunction = (e, car, node, user) => {
  return lengthFunction(e) / velocityFunction(e, car, node, user)
    * (e.coverType ? e.coverType.slowdown : 1)
    + wastedTimeFunction(e, car, node)
    + pauseTimeFunction(e, car, node, user);
};

const costFunction = (e, car, node, user) => {
  return 100000 / lengthFunction(e) * car.fuelConsumption * 10
    + ((e.policeman && user._driveStyle !== 'LAW_ABIDING') ? e.policeman.cost : 0);
};


export const findPath = (nodes, edges, criteria, car, f, t) => (dispatch, getState) => {
  dispatch(globalFetchStart({
    message: 'Расчет пути...'
  }));

  const user = getState().auth.loggedUser;

  let weightFunction = null;

  if (criteria === 'length') {
    weightFunction = lengthFunction;
  } else if (criteria === 'time') {
    weightFunction = timeFunction;
  } else if (criteria === 'cost') {
    weightFunction = costFunction;
  } else {
    weightFunction = lengthFunction;
  }

  const graphNodes = nodes.get().reduce((obj, node) => {
    const es = edges.get({
      filter: edge => edge.from === node.id
    });

    obj[node.id + ""] = es.reduce((o, e) => {
      o[e.to + ""] = weightFunction(e, car, node, user ? user : { _driveStyle: 'LAW_ABIDING' });
      return o;
    }, {});

    return obj;
  }, {});

  console.log('graph', graphNodes);

  const graph = new Graph(graphNodes);

  console.log('from to', f, t);

  const path = graph.path(f, t);

  console.log('path', path);
};








export const saveSettings = createAction(SAVE_SETTINGS);

export const uniqueRequest = createAction(UNIQUE_REQUEST);
export const uniqueSuccess = createAction(UNIQUE_SUCCESS);
export const uniqueFailure = createNotify(UNIQUE_FAILURE);

export const unique = name => (dispatch, getState) => {
  dispatch(uniqueRequest());

  const owner = getState().auth.user;

  if (!owner) {
    return Promise.reject({
      _error: ['Войдите в систему']
    });
  }

  const config = {
    url: `${RESOURCE_URL}/search/findAllByOwnerAndNameContainingIgnoreCase`,
    params: {
      owner: owner && owner.self,
      projection: 'preview',
      page: 0,
      size: 1,
      name: name.trim()
    }
  };

  return dispatch(fetchApi(config))
      .then(data => {
        const routes = getRoutesFromResponseData(data);
        dispatch(uniqueSuccess(routes));

        if (routes.result.length > 0) {
          return Promise.reject({
            _error: [`Маршрут ${name} уже существует`]
          });
        } else {
          return Promise.resolve();
        }
      })
      .catch(error => {
        if (error.status) {
          dispatch(uniqueFailure({
            message: 'Произошла ошибка на сервере',
            notifyGlobal: true
          }));
        }

        throw error;
      });
};
