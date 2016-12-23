import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import { fetchCaches } from '../cars';
import { fetch, fetchSuccess, save, checkUniqueness, showDeleteModal } from './edit';
import CarEditForm from './components/CarEditForm';
import { getCache } from '../../cache';
import mapNormalized from '../../utils/mapNormalizedToArray';
import { validateField } from '../../forms/actions';


const validate = values => {
  if (!values) {
    return {};
  }

  const { brandName, fuelTypeName, name, fuelConsumption, maxVelocity } = values;

  const errors = {};

  errors.brandName = validateField(brandName, {
    required: {
      message: 'Выберите марку автомобиля'
    }
  });

  errors.fuelTypeName = validateField(fuelTypeName, {
    required: {
      message: 'Выберите тип топлива'
    }
  });

  errors.name = validateField(name, {
    required: {
      message: 'Введите название модели'
    },
    maxLength: {
      val: 256,
      message: 'Максимальная длина названия: 256 символов'
    },
    pattern: {
      val: /^[a-zA-Z0-9\sа-яА-Я\-]+$/,
      message: 'Название может содержать только цифры и буквы'
    }
  });

  errors.fuelConsumption = validateField(fuelConsumption, {
    min: {
      val: 1.0,
      message: 'Расход должен быть больше 1 литра'
    },
    max: {
      val: 30.0,
      message: 'Расход не может быть больше 30 литров'
    }
  });

  errors.maxVelocity = validateField(maxVelocity, {
    min: {
      val: 50,
      message: 'Максимальная скорость должна быть больше 50 км/ч'
    },
    max: {
      val: 350,
      message: 'Максимальная скорость не может быть больше 350 км/ч'
    }
  });

  return errors;
};

const asyncValidate = (values, dispatch, { params }) => {
  if (params.carId) {
    return Promise.resolve();
  } else {
    return dispatch(checkUniqueness(values));
  }
};

const Form = reduxForm({
  form: 'FuelTypeEditForm',
  enableReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['name', 'brandName', 'fuelTypeName']
})(CarEditForm);

const errorsSelector = getFormSyncErrors('FuelTypeEditForm');

const getBrandsCache = getCache('brands');
const getFuelTypesCache = getCache('fuelTypes');

export default connect(
  state => ({
    isLoading: state.cars.edit.isLoading,
    formErrors: errorsSelector(state),
    initialValues: state.cars.edit.car
      ? state.cars.edit.car.toPlainObject()
      : { fuelConsumption: 15.0, maxVelocity: 50 },
    brands: mapNormalized(getBrandsCache(state)),
    fuelTypes: mapNormalized(getFuelTypesCache(state))
  }),
  dispatch => ({
    loadCaches: () => dispatch(fetchCaches()),
    loadCar: id => dispatch(fetch(id)),
    resetCar: () => dispatch(fetchSuccess(null)),
    saveCar: (id, values) => dispatch(save(id, values)),
    deleteCar: () => dispatch(showDeleteModal())
  })
)(Form);
