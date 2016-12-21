import { connect } from 'react-redux';
import { resetNotification } from './notifications';
import Notification from './components/Notification';


export default connect(
  state => ({ ...state.notifications }),
  dispatch => ({ dismiss: () => dispatch(resetNotification()) })
)(Notification);
