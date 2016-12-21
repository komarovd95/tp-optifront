import { connect } from 'react-redux';
import FuelTypesList from './components/FuelTypesList';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { fetchList } from './list';


export default connect(
  state => ({
    isFetching: state.fuelTypes.list.isFetching,
    fuelTypes: mapNormalized(state.fuelTypes.list.data),
    pageable: state.fuelTypes.list.pageable,
    filter: state.fuelTypes.list.filter.fuelTypeName
  }),
  dispatch => ({
    requestData: (p, s, f) => dispatch(fetchList(p, s, f))
  })
)(FuelTypesList);

