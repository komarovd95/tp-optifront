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

// const CREATE_REQUEST    = 'routes/CREATE_REQUEST';
// const CREATE_SUCCESS    = 'routes/CREATE_SUCCESS';
// const CREATE_FAILURE    = 'routes/CREATE_FAILURE';

// const CHANGE_REQUEST    = 'routes/CHANGE_REQUEST';
// const CHANGE_SUCCESS    = 'routes/CHANGE_SUCCESS';
// const CHANGE_FAILURE    = 'routes/CHANGE_FAILURE';
//
// const REMOVE_REQUEST    = 'routes/REMOVE_REQUEST';
// const REMOVE_SUCCESS    = 'routes/REMOVE_SUCCESS';
// const REMOVE_FAILURE    = 'routes/REMOVE_FAILURE';


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
      const route = new PathRoute(data); // dTODO schema
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


// export const createRequest = createAction(CREATE_REQUEST);
// export const createSuccess = createAction(CREATE_SUCCESS);
// export const createFailure = createAction(CREATE_FAILURE);

// TODO
// export const create = credentials => dispatch => {
//   dispatch(createRequest());
//
//   const config = {
//     url: RESOURCE_URL,
//     method: 'post',
//     data: window.JSON.stringify(credentials),
//     successStatus: 201
//   };
//
//   return dispatch(fetchApi(config))
//     .then(data => {
//       const user = new PathUser(data);
//       dispatch(createSuccess(user));
//       return user;
//     })
//     .catch(error => {
//       dispatch(createFailure(error));
//       throw error;
//     });
// };


// export const changeRequest = createAction(CHANGE_REQUEST);
// export const changeSuccess = createAction(CHANGE_SUCCESS);
// export const changeFailure = createAction(CHANGE_FAILURE);
//
// export const change = (user, { password, roles, driveStyle }) => dispatch => {
//   const requestData = {};
//
//   if (password) {
//     requestData.password = password;
//   }
//
//   if (roles) {
//     requestData.roles = roles;
//   }
//
//   if (driveStyle) {
//     requestData.driveStyle = driveStyle;
//   }
//
//   dispatch(changeRequest(user));
//
//   const config = {
//     url: `${RESOURCE_URL}/${user.id}`,
//     method: 'patch',
//     data: window.JSON.stringify(requestData)
//   };
//
//   return dispatch(fetchApi(config))
//     .then(data => {
//       const user = new PathUser(data);
//
//       dispatch(changeSuccess(user));
//
//       if (password) {
//         dispatch(storeData(LOGIN_ITEM_NAME,
//           Buffer.from(user.username + ':' + password.trim(), 'ascii')
//             .toString('base64')));
//       }
//
//       return user;
//     })
//     .catch(error => {
//       dispatch(changeFailure(error));
//       throw error;
//     });
// };
//
//
// const removeRequest = createAction(REMOVE_REQUEST);
// const removeSuccess = createAction(REMOVE_SUCCESS);
// const removeFailure = createAction(REMOVE_FAILURE);
//
// export const remove = user => dispatch => {
//   dispatch(removeRequest());
//
//   const config = {
//     url: `${RESOURCE_URL}/${user.id}`,
//     method: 'delete',
//     successStatus: 204
//   };
//
//   return dispatch(fetchApi(config))
//     .then(() => dispatch(removeSuccess()))
//     .catch(error => {
//       dispatch(removeFailure(error));
//       throw error;
//     });
// };
//
//
// const deleteRequest = createAction(types.DELETE_ROUTE_REQUEST);
// const deleteSuccess = createAction(types.DELETE_ROUTE_SUCCESS);
// const deleteFailure = createAction(types.DELETE_ROUTE_FAILURE);
//
// export const deleteRoute = (id) => (dispatch) => {
//   dispatch(deleteRequest());
//
//   const config = {
//     url: `${RESOURCE_URL}/${id}`,
//     method: 'DELETE',
//     success: 204
//   };
//
//   return dispatch(fetchApi(config))
//     .then(() => dispatch(deleteSuccess()))
//     .catch(error => {
//       dispatch(deleteFailure(error));
//       throw error;
//     });
// };


