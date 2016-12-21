import { createAction } from 'redux-actions';


const SHOW = 'modal/SHOW';
const CLOSE = 'modal/CLOSE';


const initialState = {
  isOpen: false,
  modalInfo: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW:
      return {
        isOpen: true,
        modalInfo: action.payload
      };

    case CLOSE:
      return initialState;

    default:
      return state;
  }
}


export const showModal = createAction(SHOW);
export const closeModal = createAction(CLOSE);
