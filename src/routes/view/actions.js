// import { createAction } from 'redux-actions';
// import { fetchOne } from '../actions';
// import { createNotify } from '../../notifications/actions';
// import { EXAMPLE_NODES, EXAMPLE_EDGES } from './constants';
// import * as types from './actionTypes';
// import * as vis from "vis";
//
//
// const loadRouteRequest = createAction(types.LOAD_REQUEST);
// const loadRouteSuccess = createAction(types.LOAD_SUCCESS);
// const loadRouteFailure = createNotify(types.LOAD_FAILURE);
//
// export const loadRoute = (method) => (dispatch, getState) => {
//   dispatch(loadRouteRequest());
//
//   if (method === 'new') {
//     return new Promise(resolve => {
//
//     });
//   } else if (method === 'example') {
//
//   } else if (method) {
//     return dispatch(fetchOne(method))
//       .then(route => {
//         dispatch(loadRouteSuccess(route));
//         return route;
//       })
//       .catch(() => {
//         dispatch(loadRouteFailure({
//           message: 'Ошибка при загрузке маршрута',
//           notifyGlobal: true
//         }));
//       });
//   }
//
//
//   // const data = getState().routes.view.data;
//   //
//   // const routes = Object.keys(data.entities.routes).map(k => data.entities.routes[k]);
//   // let edges;
//   // let nodes;
//   //
//   // if (n && e) {
//   //   nodes = n;
//   //   edges = e;
//   // } else {
//   //   nodes = new vis.DataSet();
//   //   edges = new vis.DataSet();
//   // }
//   //
//   // dispatch(loadRouteRequest());
//   //
//   // if (method === 'new') {
//   //   return new Promise(resolve => {
//   //     const result = { nodes, edges };
//   //
//   //     dispatch(loadRouteSuccess(result));
//   //     resolve(result);
//   //   });
//   // } else if (method === 'example') {
//   //   nodes.add(EXAMPLE_NODES);
//   //   edges.add(EXAMPLE_EDGES);
//   //
//   //
//   // } else if (method) {
//   //   return dispatch(fetchOne(method))
//   //     .then(route => {
//   //       edges.add(route.edges.map(edge => ({
//   //         id: edge.id,
//   //         from: edge.from,
//   //         to: edge.to,
//   //         value: edge.lanes,
//   //         arrows: edge.directed ? 'to' : ''
//   //       })));
//   //
//   //       nodes.add(route.nodes.map(node => ({
//   //         id: node.id,
//   //         x: node.x,
//   //         y: node.y,
//   //         shape: 'circularImage',
//   //         image: node.light ? '../images/traffic-light.png' : '',
//   //         label: node.light && `${node.light.redPhase} ${node.light.greenPhase}`,
//   //         color: {
//   //           border: '#7c29f0',
//   //           background: '#ad85e4',
//   //           highlight: {
//   //             border: '#7c29f0',
//   //             background: '#d3bdf0'
//   //           }
//   //         },
//   //         light: node.light,
//   //         value: edges.get({
//   //           filter: item => item.from === node.id || item.to === node.id
//   //         }).reduce((sum, item) => sum + item.value, 0)
//   //       })));
//   //
//   //       dispatch(loadRouteSuccess({ nodes, edges }));
//   //
//   //       return { nodes, edges };
//   //     })
//   //     .catch(() => dispatch(loadRouteFailure({
//   //       message: 'Ошибка при загрузке маршрута',
//   //       notifyGlobal: true
//   //     })));
//   // }
//
// };
//
//
// export const loadNetwork = createAction(types.LOAD_NETWORK);
