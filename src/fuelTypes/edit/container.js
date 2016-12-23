import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import FuelTypeEditForm from './components/FuelTypeEditForm';
import { validateField } from '../../forms/actions';
import { fetch, fetchSuccess, save, checkUniqueness, showDeleteModal } from './edit';


const validate = values => {
  if (!values) {
    return {};
  }

  const { fuelTypeName, cost } = values;

  const errors = {};

  errors.fuelTypeName = validateField(fuelTypeName, {
    required: {
      message: 'Введите название типа топлива автомобиля'
    },
    minLength: {
      val: 1,
      message: 'Название должно содержать хотя бы 1 символ'
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

  errors.cost = validateField(cost, {
    min: {
      val: 1,
      message: 'Цена должна составлять не менее 1 рубля за литр'
    },
    max: {
      max: 300,
      message: 'Цена должна быть не более 300 рублей за литр'
    }
  });

  return errors;
};

const asyncValidate = (values, dispatch) => dispatch(checkUniqueness(values));

const Form = reduxForm({
  form: 'FuelTypeEditForm',
  enableReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['fuelTypeName']
})(FuelTypeEditForm);


const errorsSelector = getFormSyncErrors('FuelTypeEditForm');

export default connect(
  state => ({
    formErrors: errorsSelector(state),
    initialValues: state.fuelTypes.edit.fuelType && state.fuelTypes.edit.fuelType.toPlainObject()
  }),
  dispatch => ({
    loadFuelType: id => dispatch(fetch(id)),
    resetFuelType: () => dispatch(fetchSuccess(null)),
    saveFuelType: (id, values) => dispatch(save(id, values)),
    deleteFuelType: () => dispatch(showDeleteModal())
  })
)(Form);
