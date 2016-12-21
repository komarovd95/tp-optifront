import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import { validateField } from '../../forms/actions';
import { signIn } from '../auth/auth';
import SignInForm from './components/SignInForm';
import { Link } from 'react-router';
import Animation from '../../commons/Animation';


const validate = ({ username, password }) => {
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

  return errors;
};

const Form = reduxForm({
  form: "SignInForm",
  validate
})(SignInForm);


const errorsSelector = getFormSyncErrors('SignInForm');

const Connected = connect(
  state => ({ fieldErrors: errorsSelector(state) }),
  dispatch => ({ signIn: credentials => dispatch(signIn(credentials)) })
)(Form);

class SignIn extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        nextPathname: PropTypes.string
      })
    }).isRequired
  };


  render() {
    return (
      <Animation>
        <div id="signin-form" className="ui middle aligned center aligned padded grid auth-form">
          <div className="column">
            <h2 className="ui teal header">
              Войти
            </h2>
            <Connected location={this.props.location}/>
            <div className="ui message">
              Нет аккаунта?<Link to="signup"> Зарегистрируйтесь</Link>
            </div>
          </div>
        </div>
      </Animation>
    );
  }
}


export default SignIn;


