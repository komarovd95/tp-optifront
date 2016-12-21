import { createAction } from 'redux-actions';


const SET = 'routes/view/settings/SET';


const defaultState = {
  lights: true,
  length: true,
  coverTypes: true,
  streetNames: true,
  limits: true,
  traffic: true,
  police: true
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET:
      return {
        ...state,
        [action.payload]: !state[action.payload]
      };

    default:
      return state;
  }
};


export const set = createAction(SET);
