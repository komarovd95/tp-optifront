import { connect } from 'react-redux';
import Spinner from './components/Spinner';


export default connect(state => ({
  active: state.app.loading,
  message: state.app.message
}))(Spinner);
