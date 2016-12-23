import { createAction } from 'redux-actions';
import functions from './weight-functions';
import Graph from 'node-dijkstra';
import {globalFetchStart, globalFetchEnd} from "../../app/app";
import {createNotify} from "../../notifications/notifications";


const SET_FROM = 'routes/view/path/SET_FROM';
const SET_TO   = 'routes/view/path/SET_TO';
const FIND_START = 'routes/view/path/FIND_START';
const FIND_END = 'routes/view/path/FIND_END';


const defaultState = {
  criteria: null,
  from: null,
  to: null,
  path: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_FROM:
      return {
        ...state,
        from: action.payload
      };

    case SET_TO:
      return {
        ...state,
        to: action.payload
      };

    case FIND_END:
      return {
        ...state,
        path: {
          path: action.payload.path || [],
          cost: action.payload.cost
        }
      };

    default:
      return state;
  }
};


export const setFrom = createAction(SET_FROM);
export const setTo   = createAction(SET_TO);


const findResult = createAction(FIND_END);
const invalid = createNotify('routes/view/path/INVALID');

export const find = ({car, criteria}) => (dispatch, getState) => {
  const { user } = getState().auth;
  const { nodes, edges } = getState().routes.view.manipulation.present;
  const { from, to } = getState().routes.view.path;
  const { entities: fuelTypes } = getState().cache.fuelTypes;

  const driveStyle = user ? user._driveStyle : 'LAW_ABIDING';

  dispatch(globalFetchStart({
    message: 'Расчет пути...'
  }));

  const weightFunction = functions[criteria].bind(null, car, driveStyle);

  for (let key in edges) {
    if (!edges.hasOwnProperty(key)) {
      continue;
    }

    const { length, limit, coverType, street, traffic } = edges[key];

    if (!length || length < 100 || length > 50000) {
      dispatch(globalFetchEnd());
      dispatch(invalid({
        message: 'Длина участка дороги должна быть в пределах от 100 до 50000 м',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (!limit || limit < 20 || limit > 110) {
      dispatch(globalFetchEnd());
      dispatch(invalid({
        message: 'Ограничение скорости должно быть в пределах от 20 до 110 км/ч',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (!coverType) {
      dispatch(globalFetchEnd());
      dispatch(invalid({
        message: 'Укажите тип покрытия у каждого участка дороги',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (!street) {
      dispatch(globalFetchEnd());
      dispatch(invalid({
        message: 'Укажите название улицы у каждого участка дороги',
        notifyGlobal: true
      }));
      return Promise.reject();
    }

    if (traffic >= 0 && traffic > limit) {
      dispatch(globalFetchEnd());
      dispatch(invalid({
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
      dispatch(invalid({
        message: 'Найдены несоединенные вершины',
        notifyGlobal: true
      }));
      return Promise.reject();
    }
  }

  const fuelType = Object.keys(fuelTypes).map(k => fuelTypes[k])
    .find(fT => fT.fuelTypeName === car.fuelTypeName);

  const graphNodes = Object.keys(nodes).map(k => nodes[k]).reduce((obj, node) => {
    obj[node.id] = Object.keys(edges).map(k => edges[k])
      .filter(edge => (edge.from === node.id || (!edge.directed && edge.to === node.id)))
      .reduce((eObj, edge) => {
        if (!edge.directed && edge.to === node.id) {
          eObj[edge.from] = weightFunction(node, edge, fuelType.cost);
        } else {
          eObj[edge.to] = weightFunction(node, edge, fuelType.cost);
        }

        return eObj;
      }, {});

    return obj;
  }, {});
  const graph = new Graph(graphNodes);

  return new Promise(resolve => resolve(graph.path(from, to, { cost: true })))
    .then(path => {
      dispatch(globalFetchEnd());
      dispatch(findResult(path));
      return path;
    });
};
