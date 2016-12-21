import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import CoverTypeEditForm from './components/CoverTypeEditForm';
import { validateField } from '../../forms/actions';
import { fetch, fetchSuccess, save, checkUniqueness, showDeleteModal } from './edit';


const validate = values => {
  if (!values) {
    return {};
  }

  const { coverTypeName, slowdown } = values;

  const errors = {};

  errors.coverTypeName = validateField(coverTypeName, {
    required: {
      message: 'Введите название типа покрытия автомобиля'
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

  errors.slowdown = validateField(slowdown, {
    min: {
      val: 0,
      message: 'Коэффициент замедления должен быть больше 0'
    },
    max: {
      max: 1,
      message: 'Коэффициент замедления должен быть меньше 1'
    }
  });

  return errors;
};

const asyncValidate = (values, dispatch) => dispatch(checkUniqueness(values));

const Form = reduxForm({
  form: 'CoverTypeEditForm',
  enableReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['coverTypeName']
})(CoverTypeEditForm);


const errorsSelector = getFormSyncErrors('CoverTypeEditForm');

export default connect(
  state => ({
    formErrors: errorsSelector(state),
    initialValues: state.coverTypes.edit.coverType && state.coverTypes.edit.coverType.toPlainObject()
  }),
  dispatch => ({
    loadCoverType: id => dispatch(fetch(id)),
    resetCoverType: () => dispatch(fetchSuccess(null)),
    saveCoverType: (id, values) => dispatch(save(id, values)),
    deleteCoverType: () => dispatch(showDeleteModal())
  })
)(Form);
