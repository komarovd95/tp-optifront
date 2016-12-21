import { connect } from 'react-redux';
import CoverTypesList from './components/CoverTypesList';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { fetchList } from './list';


export default connect(
  state => ({
    isFetching: state.coverTypes.list.isFetching,
    coverTypes: mapNormalized(state.coverTypes.list.data),
    pageable: state.coverTypes.list.pageable,
    filter: state.coverTypes.list.filter.coverTypeName
  }),
  dispatch => ({
    requestData: (p, s, f) => dispatch(fetchList(p, s, f))
  })
)(CoverTypesList);

