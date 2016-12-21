import {connect} from 'react-redux';
import GlobalDimmer from './components/GlobalDimmer';


const mapStateToProps = (state) => ({
  active: state.dimmer.active
});

export default connect(mapStateToProps)(GlobalDimmer);
