import {createSelector} from 'reselect';


// const getRoutes = (state) => state.routes.list.data.routes;
// const getRoutesResult   = (state) => state.routes.list.data.routes.result;
//
// export const getRoutesArray = createSelector(getRoutes, routes => {
//   if (routes && routes.entities && routes.result) {
//     return routes.result.map(id => routes.entities[id]);
//   } else {
//     return [];
//   }
// });


const getRoutesEntities = state => state.routes.list.data.entities;
const getRoutesResult   = state => state.routes.list.data.result;

export const getRoutesArray = createSelector(getRoutesEntities, getRoutesResult,
  (entities, result) => result ? result.map(id => entities[id]) : []);



// const getEntity = state => state.routes.view
//
// export const getNodesArray = createSelector(() => {
//
// });
