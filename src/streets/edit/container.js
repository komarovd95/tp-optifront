import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import StreetEditForm from './components/StreetEditForm';
import { validateField } from '../../forms/actions';
import { fetch, fetchSuccess, save, checkUniqueness, showDeleteModal, fetchTypes } from './edit';
import { getCache } from '../../cache';


const validate = values => {
  if (!values) {
    return {};
  }

  const { streetName, streetType } = values;

  const errors = {};

  errors.streetName = validateField(streetName, {
    required: {
      message: 'Введите название улицы'
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

  errors.streetType = validateField(streetType, {
    required: {
      message: 'Выберите тип улицы'
    }
  });

  return errors;
};

const asyncValidate = (values, dispatch) => dispatch(checkUniqueness(values));

const Form = reduxForm({
  form: 'StreetEditForm',
  enableReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['streetName']
})(StreetEditForm);


const errorsSelector = getFormSyncErrors('StreetEditForm');
const getStreetTypesCache = getCache('streetTypes');

export default connect(
  state => ({
    formErrors: errorsSelector(state),
    initialValues: state.streets.edit.street && state.streets.edit.street.toPlainObject(),
    streetTypes: getStreetTypesCache(state)
  }),
  dispatch => ({
    loadCache: () => dispatch(fetchTypes()),
    loadStreet: id => dispatch(fetch(id)),
    resetStreet: () => dispatch(fetchSuccess(null)),
    saveStreet: (id, values) => dispatch(save(id, values)),
    deleteStreet: () => dispatch(showDeleteModal())
  })
)(Form);
