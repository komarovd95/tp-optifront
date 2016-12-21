import { connect } from 'react-redux';
import RoutesList from './components/RoutesList';
import { fetchListForUser as forUser, fetchListForAdmin as forAdmin } from './list';
import { getRoutesArray } from '../selectors';


export default connect(
  state => ({
    routes: getRoutesArray(state),
    pageable: state.routes.list.pageable,
    filter: state.routes.list.filter.name,
    isFetching: state.routes.list.isFetching
  }),
  dispatch => ({
    requestData: (isAdmin, p, s, f) => dispatch(isAdmin ? forAdmin(p, s, f) : forUser(p, s, f))
  })
)(RoutesList);
