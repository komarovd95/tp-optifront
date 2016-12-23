import { createAction } from 'redux-actions';
import { RESOURCE_URL } from './constants';
import { fetchApi } from '../api';
import { getRoutesFromResponseData, PathRoute } from './model';


const FETCH_ONE_REQUEST = 'routes/FETCH_ONE_REQUEST';
const FETCH_ONE_SUCCESS = 'routes/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE = 'routes/FETCH_ONE_FAILURE';

const FETCH_ALL_REQUEST = 'routes/FETCH_ALL_REQUEST';
const FETCH_ALL_SUCCESS = 'routes/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'routes/FETCH_ALL_FAILURE';

const CREATE_REQUEST    = 'routes/CREATE_REQUEST';
const CREATE_SUCCESS    = 'routes/CREATE_SUCCESS';
const CREATE_FAILURE    = 'routes/CREATE_FAILURE';

const UPDATE_REQUEST    = 'routes/UPDATE_REQUEST';
const UPDATE_SUCCESS    = 'routes/UPDATE_SUCCESS';
const UPDATE_FAILURE    = 'routes/UPDATE_FAILURE';

const REMOVE_REQUEST    = 'routes/REMOVE_REQUEST';
const REMOVE_SUCCESS    = 'routes/REMOVE_SUCCESS';
const REMOVE_FAILURE    = 'routes/REMOVE_FAILURE';


export const fetchOneRequest = createAction(FETCH_ONE_REQUEST);
export const fetchOneSuccess = createAction(FETCH_ONE_SUCCESS);
export const fetchOneFailure = createAction(FETCH_ONE_FAILURE);

export const fetchOne = id => dispatch => {
  dispatch(fetchOneRequest());

  const config = {
    url: `${RESOURCE_URL}/${id}`
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const route = new PathRoute(data);
      dispatch(fetchOneSuccess(route));
      return route;
    })
    .catch(error => {
      dispatch(fetchOneFailure(error));
      throw error;
    });
};


export const fetchAllRequest = createAction(FETCH_ALL_REQUEST);
export const fetchAllSuccess = createAction(FETCH_ALL_SUCCESS);
export const fetchAllFailure = createAction(FETCH_ALL_FAILURE);

export const fetchAll = (owner, pageable, sort, filter, projection) => dispatch => {
  dispatch(fetchAllRequest());

  const searchUrl = owner
    ? 'findAllByOwnerAndNameContainingIgnoreCase'
    : 'findAllByNameContainingIgnoreCase';

  const config = {
    url: `${RESOURCE_URL}/search/${searchUrl}`,
    params: {
      owner: owner && owner.self,
      projection,
      page: pageable.page,
      size: pageable.size,
      sort: `${sort.sortColumn},${sort.sortDirection}`,
      name: filter.name
    }
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const routes = getRoutesFromResponseData(data);

      dispatch(fetchAllSuccess(routes));

      return {
        routes,
        page: data.page
      };
    })
    .catch(error => {
      dispatch(fetchAllFailure(error));
      throw error;
    });
};

export const createRequest = createAction(CREATE_REQUEST);
export const createSuccess = createAction(CREATE_SUCCESS);
export const createFailure = createAction(CREATE_FAILURE);

export const create = (owner, { name, nodes, edges }) => dispatch => {
  dispatch(createRequest());

  const config = {
    url: RESOURCE_URL,
    method: 'post',
    data: window.JSON.stringify({
      owner: owner.self,
      name: name.trim(),
      nodes: Object.keys(nodes).map(key => nodes[key]),
      edges: Object.keys(edges).map(key => edges[key])
    }),
    successStatus: 201
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const route = new PathRoute(data);
      dispatch(createSuccess(route));
      return route;
    })
    .catch(error => {
      dispatch(createFailure(error));
      throw error;
    });
};


export const updateRequest = createAction(UPDATE_REQUEST);
export const updateSuccess = createAction(UPDATE_SUCCESS);
export const updateFailure = createAction(UPDATE_FAILURE);

const plainObject = obj => Object.keys(obj).reduce((o, key) => {
  const subKey = key.substring(1);
  o[subKey] = obj[key];
  return o;
}, {});

export const update = (route, name, nodes, edges) => dispatch => {
  dispatch(updateRequest());

  const config = {
    url: `${RESOURCE_URL}/${route.id}`,
    method: 'patch',
    data: window.JSON.stringify({
      name,
      nodes: Object.keys(nodes).map(key => nodes[key]),
      edges: Object.keys(edges).map(key => edges[key]).map(edge => ({
        ...edge,
        coverType: plainObject(edge.coverType),
        street: plainObject(edge.street)
      }))
    })
  };

  return dispatch(fetchApi(config))
    .then(data => {
      const route = new PathRoute(data);
      dispatch(updateSuccess(route));
      return route;
    })
    .catch(error => {
      dispatch(updateFailure(error));
      throw error;
    });
};


const removeRequest = createAction(REMOVE_REQUEST);
const removeSuccess = createAction(REMOVE_SUCCESS);
const removeFailure = createAction(REMOVE_FAILURE);

export const remove = route => dispatch => {
  dispatch(removeRequest());

  const config = {
    url: `${RESOURCE_URL}/${route.id}`,
    method: 'delete',
    successStatus: 204
  };

  return dispatch(fetchApi(config))
    .then(() => dispatch(removeSuccess()))
    .catch(error => {
      dispatch(removeFailure(error));
      throw error;
    });
};
