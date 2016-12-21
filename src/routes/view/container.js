import { connect } from 'react-redux';
import RouteView from './components/RouteView';
import { load, fetchCaches, findPath } from './view';
import { addNode, addEdge, updateNode, updateEdge } from './manipulation';
import { getNetworkNodes, getNetworkEdges } from './selectors';


export default connect(
  state => ({
    settings: state.routes.view.settings,
    ...state.routes.view.manipulation.present
  }),
  dispatch => ({
    loadCaches: () => dispatch(fetchCaches()),
    loadRoute: id => dispatch(load(id)),
    findPath: (n, e, ca, car, f, t) => dispatch(findPath(n, e, ca, car, f, t)),
    addNode: node => dispatch(addNode(node)),
    addEdge: edge => dispatch(addEdge(edge)),
    updateNode: node => dispatch(updateNode(node)),
    updateEdge: edge => dispatch(updateEdge(edge))
  })
)(RouteView);

// import RouteContainer from './components/RouteContainer';
// import { loadRoute, loadNetwork } from './actions';
//
//
// const mapStateToProps = (state) => ({
//   nodes: state.routes.view.data.nodes,
//   edges: state.routes.view.data.edges
// });
//
// const mapDispatchToProps = (dispatch) => ({
//   loadRoute: () => dispatch(loadRoute(1)),
//   loadNetwork: (network) => dispatch(loadNetwork({ network }))
// });
//
// export default connect(mapStateToProps, mapDispatchToProps)(RouteContainer);
