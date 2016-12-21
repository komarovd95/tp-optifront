import { createAction } from 'redux-actions';


const CACHE_PUT   = 'cache/PUT';
const CACHE_EVICT = 'cache/EVICT';


export default function reducer(state = {}, action) {
  switch (action.type) {
    case CACHE_PUT:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };

    case CACHE_EVICT:
      if (action.payload) {
        const newState = { ...state };
        delete newState[action.payload];
        return newState;
      } else {
        return {};
      }

    default:
      return state;
  }
}


export const cachePut   = createAction(CACHE_PUT);
export const cacheEvict = createAction(CACHE_EVICT);


export const getCache = key => state => state.cache[key];
