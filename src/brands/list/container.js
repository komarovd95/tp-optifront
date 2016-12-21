import { connect } from 'react-redux';
import BrandsList from './components/BrandsList';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { fetchList } from './list';


export default connect(
  state => ({
    isFetching: state.brands.list.isFetching,
    brands: mapNormalized(state.brands.list.data),
    pageable: state.brands.list.pageable,
    filter: state.brands.list.filter.brandName
  }),
  dispatch => ({
    requestData: (p, s, f) => dispatch(fetchList(p, s, f))
  })
)(BrandsList);
