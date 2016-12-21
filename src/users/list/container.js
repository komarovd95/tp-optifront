import { connect } from 'react-redux';
import { fetchList } from './list';
import UsersList from './components/UsersList';
import { getUsersArray } from '../selectors';


export default connect(
  state => ({
    users: getUsersArray(state),
    isFetching: state.users.list.isFetching,
    pageable: state.users.list.pageable,
    filter: state.users.list.filter
  }),
  dispatch => ({
    requestData: (p, s, f) => dispatch(fetchList(p, s, f))
  })
)(UsersList);
