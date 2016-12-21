import { connect } from 'react-redux';
import StreetsList from './components/StreetsList';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { fetchList } from './list';


export default connect(
  state => ({
    isFetching: state.streets.list.isFetching,
    streets: mapNormalized(state.streets.list.data),
    pageable: state.streets.list.pageable,
    filter: state.streets.list.filter,
    streetTypes: state.cache.streetTypes
  }),
  dispatch => ({
    requestData: (p, s, f) => dispatch(fetchList(p, s, f))
  })
)(StreetsList);

