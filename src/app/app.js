import { createAction } from 'redux-actions';


const FETCH_START = 'app/FETCH_START';
const FETCH_END   = 'app/FETCH_END';


const initialState = {
  loading: false,
  message: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_START:
      return {
        ...state,
        loading: true,
        message: action.payload && action.payload.message
      };

    case FETCH_END:
      return initialState;

    default:
      return state;
  }
}

export const globalFetchStart = createAction(FETCH_START);
export const globalFetchEnd   = createAction(FETCH_END);
