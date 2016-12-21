import { createAction } from 'redux-actions';
import { createNotify } from '../../notifications/notifications';
import { fetchAll } from '../cars';
import { addCar, removeCar } from '../../users/users';
import { Pageable, Sort } from '../../utils/CallAPI';
import merge from 'lodash/merge';
import { Car } from '../model';


const FETCH_REQUEST = 'cars/list/FETCH_REQUEST';
const FETCH_SUCCESS = 'cars/list/FETCH_SUCCESS';
const FETCH_FAILURE = 'cars/list/FETCH_FAILURE';

const ADD_CAR_TO_USER_REQUEST = 'cars/list/ADD_CAR_TO_USER_REQUEST';
const ADD_CAR_TO_USER_SUCCESS = 'cars/list/ADD_CAR_TO_USER_SUCCESS';
const ADD_CAR_TO_USER_FAILURE = 'cars/list/ADD_CAR_TO_USER_FAILURE';

const REMOVE_CAR_FROM_USER_REQUEST = 'cars/list/REMOVE_CAR_FROM_USER_REQUEST';
const REMOVE_CAR_FROM_USER_SUCCESS = 'cars/list/REMOVE_CAR_FROM_USER_SUCCESS';
const REMOVE_CAR_FROM_USER_FAILURE = 'cars/list/REMOVE_CAR_FROM_USER_FAILURE';


const initialState = {
  isFetching: false,
  data: {},
  pageable: new Pageable(0, 20, 0, 0),
  sort: new Sort('name'),
  filter: {
    name: '',
    brand: [],
    fuelType: [],
    fuelConsumption: '1-30',
    maxVelocity: '50-350',
    onlyMine: true
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        pageable: action.payload.page,
        sort: action.payload.sort,
        filter: action.payload.filter,
        isFetching: true
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload.cars,
        pageable: action.payload.page,
        isFetching: false
      };

    case FETCH_FAILURE:
      return {
        ...state,
        isFetching: false
      };

    case REMOVE_CAR_FROM_USER_SUCCESS:
    case ADD_CAR_TO_USER_SUCCESS: {
      const entities = { ...state.data.entities };
      entities[action.payload.id] = action.payload;

      return {
        ...state,
        data: {
          result: state.data.result,
          entities
        }
      };
    }

    default:
      return state;
  }
}


export const fetchListRequest = createAction(FETCH_REQUEST);
export const fetchListSuccess = createAction(FETCH_SUCCESS);
export const fetchListFailure = createNotify(FETCH_FAILURE);

export const fetchList = (isAdmin, pageable, sort, filter) => (dispatch, getState) => {
  const { pageable: p, sort: s, filter: f } = getState().cars.list;

  let sortObj = {};
  if (sort) {
    const [sortColumn, sortDirection] = sort.split(',');
    sortObj = { sortColumn, sortDirection };
  }

  const newPage = p.mergeWith(pageable);
  const newSort = s.mergeWith(sortObj);
  const newFilter = merge({}, f, filter);

  if (filter && filter.brand) {
    newFilter.brand = filter.brand;
  }

  if (filter && filter.fuelType) {
    newFilter.fuelType = filter.fuelType;
  }

  if (isAdmin) {
    newFilter.onlyMine = false;
  }

  dispatch(fetchListRequest({
    page: newPage,
    sort: newSort,
    filter: newFilter
  }));

  const requestFilter = {};

  if (newFilter.name) {
    requestFilter.name = newFilter.name;
  }

  if (newFilter.brand.length > 0) {
    requestFilter.brand = newFilter.brand.join(',');
  }

  if (newFilter.fuelType.length > 0) {
    requestFilter.fuelType = newFilter.fuelType.join(',');
  }

  if (newFilter.maxVelocity) {
    requestFilter.maxVelocity = newFilter.maxVelocity;
  }

  if (newFilter.fuelConsumption) {
    requestFilter.fuelConsumption = newFilter.fuelConsumption;
  }

  requestFilter.onlyMine = newFilter.onlyMine;

  const user = getState().users.profile.user;

  // if (user) {
  //   requestFilter.ownerId = user.id;
  // }

  return dispatch(fetchAll(user, newPage, newSort, requestFilter))
    .then(({ cars, page }) => {
      const fetchResult = {
        cars,
        page: newPage.mergeWith(page)
      };

      dispatch(fetchListSuccess(fetchResult));

      return fetchResult;
    }).catch(() =>
      dispatch(fetchListFailure({
        message: 'Во время загрузки данных произошла ошибка. Попробуйте позже!',
        notifyGlobal: true
      }))
    );
};


export const addCarToUserRequest = createAction(ADD_CAR_TO_USER_REQUEST);
export const addCarToUserSuccess = createAction(ADD_CAR_TO_USER_SUCCESS);
export const addCarToUserFailure = createNotify(ADD_CAR_TO_USER_FAILURE);

export const addCarToUser = car => (dispatch, getState) => {
  dispatch(addCarToUserRequest());

  const user = getState().users.profile.user;

  return dispatch(addCar(user, car))
    .then(() => {
      const serializedCar = car.serialize();
      serializedCar._links = serializedCar.links;

      const newCar = new Car(serializedCar);
      newCar.owned = true;

      dispatch(addCarToUserSuccess(newCar));

      return newCar;
    })
    .catch(() => dispatch(addCarToUserFailure({
      message: 'При добавлении произошла ошибка. Попробуйте позже!',
      notifyGlobal: true
    })));
};


export const removeCarFromUserRequest = createAction(REMOVE_CAR_FROM_USER_REQUEST);
export const removeCarFromUserSuccess = createAction(REMOVE_CAR_FROM_USER_SUCCESS);
export const removeCarFromUserFailure = createNotify(REMOVE_CAR_FROM_USER_FAILURE);

export const removeCarFromUser = car => (dispatch, getState) => {
  dispatch(removeCarFromUserRequest());

  const user = getState().users.profile.user;

  return dispatch(removeCar(user, car))
    .then(() => {
      const serializedCar = car.serialize();
      serializedCar._links = serializedCar.links;

      const newCar = new Car(serializedCar);
      newCar.owned = false;

      dispatch(removeCarFromUserSuccess(newCar));

      return newCar;
    })
    .catch(() => dispatch(removeCarFromUserFailure({
      message: 'При удалении произошла ошибка. Попробуйте позже!',
      notifyGlobal: true
    })));
};
