import { connect } from 'react-redux';
import RouteView from './components/RouteView';
import { load, fetchCaches, findPath, showDeleteModal, storeRoute, fetchCars } from './view';
import { addNode, addEdge, updateNode, updateEdge } from './manipulation';
import { setFrom, setTo } from './path';


export default connect(
  state => ({
    settings: state.routes.view.settings,
    ...state.routes.view.manipulation.present,
    from: state.routes.view.path.from,
    to: state.routes.view.path.to,
    path: state.routes.view.path.path
  }),
  dispatch => ({
    loadCaches: () => dispatch(fetchCaches()),
    loadRoute: id => dispatch(load(id)),
    loadCars: () => dispatch(fetchCars()),
    deleteRoute: () => dispatch(showDeleteModal()),
    storeRoute: () => dispatch(storeRoute()),
    findPath: (n, e, ca, car, f, t) => dispatch(findPath(n, e, ca, car, f, t)),
    addNode: node => dispatch(addNode(node)),
    addEdge: edge => dispatch(addEdge(edge)),
    updateNode: node => dispatch(updateNode(node)),
    updateEdge: edge => dispatch(updateEdge(edge)),
    setFrom: from => dispatch(setFrom(from)),
    setTo: to => dispatch(setTo(to))
  })
)(RouteView);
