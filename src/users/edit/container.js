import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import { isUserCouldBeDeleted } from '../selectors';
import { showDeleteModal } from './edit';
import { validateField } from '../../forms/actions';
import { changeUser } from '../profile/profile';
import { SecuredComponent } from '../auth';
import UserEditForm from './components/UserEditForm';


const validate = values => {
  if (!values) {
    return {};
  }

  const { password, repeatPassword } = values;

  const errors = {};

  errors.password = validateField(password, {
    minLength: {
      val: 4,
      message: 'Минимальная длина пароля: 4 символа'
    },
    maxLength: {
      val: 20,
      message: 'Максимальная длина пароля: 20 символов'
    },
    pattern: {
      val: /^[a-zA-Z0-9]+$/,
      message: 'Пароль может содержать только цифры и латинские символы'
    }
  });

  errors.repeatPassword = validateField(repeatPassword, {
    equalValue: {
      val: password,
      message: 'Введенные пароли не совпадают'
    }
  });

  return errors;
};

const Form = reduxForm({
  form: 'UserEditForm',
  enableReinitialize: true,
  validate
})(UserEditForm);

export default SecuredComponent(
  connect(
    state => ({
      initialValues: state.users.profile.user && state.users.profile.user.toPlainObject(),
      formErrors: getFormSyncErrors('UserEditForm')(state),
      isUserCouldBeDeleted: isUserCouldBeDeleted(state)
    }),
    dispatch => ({
      changeUser: values => dispatch(changeUser(values)),
      deleteUser: () => dispatch(showDeleteModal())
    })
  )(Form),
);
