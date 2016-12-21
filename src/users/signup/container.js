import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import { validateField } from '../../forms/actions';
import { signUp, checkUsername } from '../auth/auth';
import SignUpForm from './components/SignUpForm';
import { Link } from 'react-router';
import Animation from '../../commons/Animation';


const validate = ({ username, password, repeatPassword }) => {
  const errors = {};

  errors.username = validateField(username, {
    required: {
      message: 'Заполните имя'
    },
    minLength: {
      val: 4,
      message: 'Минимальная длина имени: 4 символа'
    },
    maxLength: {
      val: 20,
      message: 'Максимальная длина имени: 20 символов'
    },
    pattern: {
      val: /^[a-zA-Z0-9]+$/,
      message: 'Имя может содержать только цифры и латинские символы'
    }
  });

  errors.password = validateField(password, {
    required: {
      message: 'Заполните пароль'
    },
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
    required: {
      message: 'Повторите пароль'
    },
    equalValue: {
      val: password,
      message: 'Введенные пароли не совпадают'
    }
  });

  return errors;
};

const asyncValidate = ({ username }, dispatch) => dispatch(checkUsername(username));

const Form = reduxForm({
  form: "SignUpForm",
  validate,
  asyncValidate,
  asyncBlurFields: ['username']
})(SignUpForm);


const Connected = connect(
  state => ({
    fieldErrors: getFormSyncErrors('SignUpForm')(state)
  }),
  dispatch => ({
    signUp: credentials => dispatch(signUp(credentials))
  })
)(Form);


const SignUp = () => (
  <Animation>
    <div id="signup-form" className="ui middle aligned center aligned padded grid auth-form">
      <div className="column">
        <h2 className="ui violet header">
          Регистрация
        </h2>
        <Connected/>
        <div className="ui message">
          Уже есть аккаунт?<Link to="signin"> Войдите</Link>
        </div>
      </div>
    </div>
  </Animation>
);

export default SignUp;
