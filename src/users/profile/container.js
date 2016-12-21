import { connect } from 'react-redux';
import UserProfileInfo from './components/UserProfileInfo';


export default connect(state => ({
  user: state.users.profile.user
}))(UserProfileInfo);
