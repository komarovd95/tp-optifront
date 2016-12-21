import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import CarsList from './components/CarsList';
import { fetchList } from './list';
import { fetchCaches } from '../cars';
import { getCarsArray, getFilter } from '../selectors';
import { getCache } from '../../cache';
import mapNormalized from '../../utils/mapNormalizedToArray';


const getFilterValues = getFormValues('CarsListFilter');

const getBrandsCache = getCache('brands');
const getFuelTypesCache = getCache('fuelTypes');

export default connect(
  state => ({
    cars: getCarsArray(state),
    isFetching: state.cars.list.isFetching,
    pageable: state.cars.list.pageable,
    filter: getFilter(state),
    filterValues: getFilterValues(state),
    brands: mapNormalized(getBrandsCache(state)),
    fuelTypes: mapNormalized(getFuelTypesCache(state))
  }),
  dispatch => ({
    requestCache: () => dispatch(fetchCaches()),
    requestData: (isAdmin, p, s, f) => dispatch(fetchList(isAdmin, p, s, f))
  })
)(CarsList);
