import { createAction } from 'redux-actions';
import { combineReducers } from 'redux';
import { browserHistory } from 'react-router';
import { createNotify } from '../../notifications/notifications';
import { globalFetchStart, globalFetchEnd } from '../../app/app';
import { retrieveData, fetchApi } from '../../api';
import { PathRoute, getRoutesFromResponseData } from '../model';
import { fetchOne } from '../routes';
import { fetchCache as fetchStreets } from '../../streets/streets';
import { fetchCache as fetchCoverTypes } from '../../coverTypes/coverTypes';
import { RESOURCE_URL as CARS_URL } from '../../cars/constants';
import { getCarsFromResponseData } from '../../cars/model';
import { RESOURCE_URL } from '../constants';
import { cachePut } from '../../cache';
import Graph from 'node-dijkstra';

import manipulation, { init } from './manipulation';
import settings from './settings';



const STORAGE_ITEM = 'x-path-route';


const LOAD_REQUEST = 'routes/view/LOAD_REQUEST';
const LOAD_SUCCESS = 'routes/view/LOAD_SUCCESS';
const LOAD_FAILURE = 'routes/view/LOAD_FAILURE';

const FETCH_CACHES_REQUEST = 'routes/view/FETCH_CACHES_REQUEST';
const FETCH_CACHES_SUCCESS = 'routes/view/FETCH_CACHES_SUCCESS';
const FETCH_CACHES_FAILURE = 'routes/view/FETCH_CACHES_FAILURE';

const FETCH_CARS_REQUEST = 'routes/view/FETCH_CARS_REQUEST';
const FETCH_CARS_SUCCESS = 'routes/view/FETCH_CARS_SUCCESS';
const FETCH_CARS_FAILURE = 'routes/view/FETCH_CARS_FAILURE';

const SAVE_SETTINGS = 'routes/view/SAVE_SETTINGS';

const UNIQUE_REQUEST    = 'routes/UNIQUE_REQUEST';
const UNIQUE_SUCCESS    = 'routes/UNIQUE_SUCCESS';
const UNIQUE_FAILURE    = 'routes/UNIQUE_FAILURE';


// const initialState = {
//   route: null,
//   settings: {
//     lights: true,
//     scaleNodes: true,
//     scaleEdges: true,
//     length: true,
//     coverTypes: true,
//     streetNames: true,
//     limits: true,
//     traffic: true,
//     police: true
//   }
// };
//
// export default function reducer(state = initialState, action) {
//   switch (action.type) {
//     case LOAD_SUCCESS:
//       return {
//         ...state,
//         route: action.payload
//       };
//
//     case SAVE_SETTINGS:
//       return {
//         ...state,
//         settings: action.payload
//       };
//
//     default:
//       return state;
//   }
// }

export default combineReducers({
  manipulation,
  settings
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
        nodes: [{id: 1, x: 100, y: 100}],
        edges: [{id: 1, from: 1, to: 2}]
      }))
      .then(route => {
        dispatch(globalFetchEnd());
        dispatch(loadSuccess(route));
        dispatch(init({
          nodes: route.nodes,
          edges: route.edges
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
            obj[node.id] = {
              id: node.id,
              x: node.position.x,
              y: node.position.y,
              light: node.light
            };
            return obj;
          }, {}),
          edges: route.edges.reduce((obj, edge) => {
            obj[edge.id] = {
              id: edge.id,
              from: edge.from,
              to: edge.to,
              directed: edge.directed,
              length: edge.length,
              limit: edge.limit,
              coverType: edge.coverType,
              street: edge.street
            };
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


const fetchCachesRequest = createAction(FETCH_CACHES_REQUEST);
const fetchCachesSuccess = createAction(FETCH_CACHES_SUCCESS);
const fetchCachesFailure = createNotify(FETCH_CACHES_FAILURE);

export const fetchCaches = () => (dispatch, getState) => {
  dispatch(globalFetchStart({
    message: 'Загрузка вспомогательных данных...'
  }));

  dispatch(fetchCachesRequest());

  const { streets, coverTypes } = getState().cache;

  if (streets && coverTypes) {
    return new Promise(resolve => {
      dispatch(globalFetchEnd());

      const result = { streets, coverTypes };

      dispatch(fetchCachesSuccess(result));
      resolve(result);
    });
  } else {
    const streetsFetcher = dispatch(fetchStreets());
    const coverTypesFetcher = dispatch(fetchCoverTypes());

    return Promise.all([streetsFetcher, coverTypesFetcher])
      .then(([s, cT]) => {
        dispatch(cachePut({
          key: 'streets',
          value: s
        }));

        dispatch(cachePut({
          key: 'coverTypes',
          value: cT
        }));

        const result = { streets: s, coverTypes: cT };

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
