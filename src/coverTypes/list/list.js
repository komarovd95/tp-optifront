import { createAction } from 'redux-actions';
import { Pageable, Sort } from '../../utils/CallAPI';
import { createNotify } from '../../notifications/notifications';
import merge from 'lodash/merge';
import { fetchAll } from '../coverTypes';


const FETCH_REQUEST = 'coverTypes/list/FETCH_REQUEST';
const FETCH_SUCCESS = 'coverTypes/list/FETCH_SUCCESS';
const FETCH_FAILURE = 'coverTypes/list/FETCH_FAILURE';


const initialState = {
  isFetching: false,
  data: {},
  pageable: new Pageable(0, 20, 0, 0),
  sort: new Sort('coverTypeName'),
  filter: {
    coverTypeName: ''
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
        data: action.payload.coverTypes,
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

export const fetchList = (pageable, sort, filter) => (dispatch, getState) => {
  const { pageable: p, sort: s, filter: f } = getState().coverTypes.list;

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

  return dispatch(fetchAll(newPage, newSort, newFilter))
    .then(({ coverTypes, page }) => {
      const fetchResult = {
        coverTypes,
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
