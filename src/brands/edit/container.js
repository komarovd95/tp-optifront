import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import BrandEditForm from './components/BrandEditForm';
import { validateField } from '../../forms/actions';

import { fetch, fetchSuccess, save, checkUniqueness, showDeleteModal } from './edit';


const validate = values => {
  if (!values) {
    return {};
  }

  const { brandName } = values;

  const errors = {};

  errors.brandName = validateField(brandName, {
    required: {
      message: 'Введите название марки автомобиля'
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
      val: /^[a-zA-Z0-9\sа-яА-Я]+$/,
      message: 'Название может содержать только цифры и буквы'
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
  asyncBlurFields: ['brandName']
})(BrandEditForm);


const errorsSelector = getFormSyncErrors('FuelTypeEditForm');

export default connect(
  state => ({
    formErrors: errorsSelector(state),
    initialValues: state.brands.edit.brand && state.brands.edit.brand.toPlainObject()
  }),
  dispatch => ({
    loadBrand: id => dispatch(fetch(id)),
    resetBrand: () => dispatch(fetchSuccess(null)),
    saveBrand: (id, values) => dispatch(save(id, values)),
    deleteBrand: () => dispatch(showDeleteModal())
  })
)(Form);
