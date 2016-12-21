import { createAction } from 'redux-actions';
import { createNotify } from '../../notifications/notifications';
import { fetchAll } from '../routes';
import { Pageable, Sort } from '../../utils/CallAPI';
import merge from 'lodash/merge';


const FETCH_REQUEST = 'routes/list/FETCH_REQUEST';
const FETCH_SUCCESS = 'routes/list/FETCH_SUCCESS';
const FETCH_FAILURE = 'routes/list/FETCH_FAILURE';


const initialState = {
  isFetching: false,
  data: {},
  pageable: new Pageable(0, 20, 0, 0),
  sort: new Sort('name'),
  filter: { name: '' }
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
        data: action.payload.routes,
        pageable: action.payload.page,
        isFetching: false
      };

    case FETCH_FAILURE:
      return {
        ...state,
        isFetching: false
      };

    default:
      return state;
  }
}


export const fetchListRequest = createAction(FETCH_REQUEST);
export const fetchListSuccess = createAction(FETCH_SUCCESS);
export const fetchListFailure = createNotify(FETCH_FAILURE);

export const fetchList = (owner, pageable, sort, filter, projection) => (dispatch, getState) => {
  const { pageable: p, sort: s, filter: f } = getState().routes.list;

  let sortObj = {};
  if (sort) {
    const [sortColumn, sortDirection] = sort.split(',');
    sortObj = { sortColumn, sortDirection };
  }

  const newPage = p.mergeWith(pageable);
  const newSort = s.mergeWith(sortObj);
  const newFilter = merge({}, f, filter);

  dispatch(fetchListRequest({
    page: newPage,
    sort: newSort,
    filter: newFilter
  }));

  return dispatch(fetchAll(owner, newPage, newSort, newFilter, projection))
    .then(({ routes, page }) => {
      const fetchResult = {
        routes,
        page: newPage.mergeWith(page)
      };

      dispatch(fetchListSuccess(fetchResult));

      return fetchResult;
    }).catch(() =>
      dispatch(fetchListFailure({
        message: 'Во время загрузки данных произошла ошибка. Попробуйте позже',
        notifyGlobal: true
      }))
    );
};

export const fetchListForUser = (p, s, f) => (dispatch, getState) => {
  const profileUser = getState().users.profile.user;
  return dispatch(fetchList(profileUser, p, s, f, 'preview'));
};

export const fetchListForAdmin = (p, s, f) => dispatch =>
  dispatch(fetchList(undefined, p, s, f, 'preview'));
