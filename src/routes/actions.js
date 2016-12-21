import {createAction} from 'redux-actions';
import * as types from './actionTypes';
import { RESOURCE_URL } from './constants';
import {toPageRequest, fetchApi} from '../utils/CallAPI';
import { getRoutesFromResponseData, getRouteFromResponseData } from './model';


const fetchListRequest = createAction(types.FETCH_LIST_REQUEST);
const fetchListSuccess = createAction(types.FETCH_LIST_SUCCESS);
const fetchListFailure = createAction(types.FETCH_LIST_FAILURE);

export const fetchList = (user, page, sort, filter, projection) => (dispatch) => {
  dispatch(fetchListRequest());

  const config = {
    url: `${RESOURCE_URL}/search/findAllByOwnerAndNameContainingIgnoreCase`,
    params: {
      owner: user && user.self,
      projection,
      ...toPageRequest(page, sort, filter)
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const routes = getRoutesFromResponseData(data);

      const result = {
        routes,
        page: data.page
      };

      dispatch(fetchListSuccess(result));

      return result;
    })
    .catch(error => {
      dispatch(fetchListFailure());
      throw error;
    });
};


const deleteRequest = createAction(types.DELETE_ROUTE_REQUEST);
const deleteSuccess = createAction(types.DELETE_ROUTE_SUCCESS);
const deleteFailure = createAction(types.DELETE_ROUTE_FAILURE);

export const deleteRoute = (id) => (dispatch) => {
  dispatch(deleteRequest());

  const config = {
    url: `${RESOURCE_URL}/${id}`,
    method: 'DELETE',
    success: 204
  };

  return dispatch(fetchApi(config))
    .then(() => dispatch(deleteSuccess()))
    .catch(error => {
      dispatch(deleteFailure(error));
      throw error;
    });
};


const fetchOneRequest = createAction(types.FETCH_ONE_REQUEST);
const fetchOneSuccess = createAction(types.FETCH_ONE_SUCCESS);
const fetchOneFailure = createAction(types.FETCH_ONE_FAILURE);

export const fetchOne = (id) => (dispatch) => {
  dispatch(fetchOneRequest(id));

  return dispatch(fetchApi({ url: `${RESOURCE_URL}/${id}` }))
    .then(data => {
      const route = getRouteFromResponseData(data);

      dispatch(fetchOneSuccess(route));

      return route;
    })
    .catch(error => {
      dispatch(fetchOneFailure());

      throw error;
    })
};
