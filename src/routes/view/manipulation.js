import { createAction } from 'redux-actions';
import isEqual from 'lodash/isEqual';


const ADD_NODE    = 'routes/view/manipulation/ADD_NODE';
const ADD_EDGE    = 'routes/view/manipulation/ADD_EDGE';

const UPDATE_NODE = 'routes/view/manipulation/UPDATE_NODE';
const UPDATE_EDGE = 'routes/view/manipulation/UPDATE_EDGE';

const REMOVE_NODE = 'routes/view/manipulation/REMOVE_NODE';
const REMOVE_EDGE = 'routes/view/manipulation/REMOVE_EDGE';

const INIT        = 'routes/view/manipulation/INIT';
const UNDO        = 'routes/view/manipulation/UNDO';
const REDO        = 'routes/view/manipulation/REDO';


const defaultState = {
  nodes: null,
  edges: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case INIT:
      return action.payload;

    case ADD_NODE:
    case UPDATE_NODE: {
      const nodes = {...state.nodes};
      nodes[action.payload.id] = action.payload;

      return {
        nodes,
        edges: state.edges
      };
    }

    case ADD_EDGE:
    case UPDATE_EDGE: {
      const edges = {...state.edges};
      edges[action.payload.id] = action.payload;

      return {
        nodes: state.nodes,
        edges
      };
    }

    case REMOVE_NODE: {
      const nodes = {...state.nodes};
      delete nodes[action.payload.id];

      return {
        nodes,
        edges: state.edges
      };
    }

    case REMOVE_EDGE: {
      const edges = {...state.edges};
      delete edges[action.payload.id];

      return {
        nodes: state.nodes,
        edges
      };
    }

    default:
      return state;
  }
};

const undoReducer = reducer => {
  const historyState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  };

  return (state = historyState, action) => {
    switch (action.type) {
      case UNDO: {
        const present = state.past[state.past.length - 1];
        const past = state.past.slice(0, state.past.length - 1);
        const future = [state.present].concat(state.future);

        return {past, present, future};
      }

      case REDO: {
        const present = state.future[0];
        const future = state.future.slice(1);
        const past = state.past.concat([state.present]);

        return {past, present, future};
      }

      case INIT: {
        return {
          ...state,
          present: reducer(state.present, action)
        };
      }

      default: {
        const present = reducer(state.present, action);

        if (isEqual(state.present, present)) {
          return state;
        } else {
          if (state.past.length === 50) {
            return {
              past: state.past.slice(1).concat([state.present]),
              present,
              future: []
            };
          } else {
            return {
              past: state.past.concat([state.present]),
              present,
              future: []
            };
          }
        }
      }
    }
  };
};


export default undoReducer(reducer);


export const addNode = createAction(ADD_NODE);
export const addEdge = createAction(ADD_EDGE);

export const updateNode = createAction(UPDATE_NODE);
export const updateEdge = createAction(UPDATE_EDGE);

export const removeNode = createAction(REMOVE_NODE);
export const removeEdge = createAction(REMOVE_EDGE);

export const init = createAction(INIT);
export const undo = createAction(UNDO);
export const redo = createAction(REDO);
