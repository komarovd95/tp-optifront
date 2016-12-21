import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';
import { browserHistory } from 'react-router';
import { Field, SubmissionError } from 'redux-form';
import { AuthFormField } from '../../../forms/fields';


class SignUpForm extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired,
    fieldErrors: PropTypes.shape({
      username: PropTypes.array,
      password: PropTypes.array,
      repeatPassword: PropTypes.array
    }),
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    pristine: PropTypes.bool
  };


  onSubmit = values => this.props.signUp(values)
    .then(user => browserHistory.push(`/id${user.id}`))
    .catch(error => {
      if (error instanceof SubmissionError) {
        throw error;
      }
    });

  render() {
    const {
      handleSubmit, submitting, asyncValidating, error, pristine, fieldErrors
    } = this.props;

    const loading = submitting || asyncValidating;

    let errors = [];

    if (fieldErrors && fieldErrors.username) {
      errors = errors.concat(fieldErrors.username);
    }

    if (fieldErrors && fieldErrors.password) {
      errors = errors.concat(fieldErrors.password);
    }

    if (fieldErrors && fieldErrors.repeatPassword) {
      errors = errors.concat(fieldErrors.repeatPassword);
    }

    if (error) {
      errors.push(error);
    }

    return (
      <form className="ui large form" onSubmit={handleSubmit(this.onSubmit)}>
        <div className="ui stacked segment">
          <Field name="username"
                 type="text"
                 component={AuthFormField}
                 placeholder="Ваше имя"
                 icon="user"
                 autoFocus={true}/>
          <Field name="password"
                 type="password"
                 component={AuthFormField}
                 placeholder="Пароль"
                 icon="lock"/>
          <Field name="repeatPassword"
                 type="password"
                 component={AuthFormField}
                 placeholder="Повторите пароль"
                 icon="lock"/>
          <button type="submit"
                  className={`ui fluid large violet submit ${loading ? 'loading' : ''} button`}
                  disabled={submitting || asyncValidating || pristine}>
            Зарегистрироваться
          </button>
        </div>

        <div className="ui error message">
          <ul className="list">
            {errors.length > 0 && !pristine && errors.map(e => <li key={shortid.generate()}>{e}</li>)}
          </ul>
        </div>

      </form>
    );
  }
}


export default SignUpForm;
