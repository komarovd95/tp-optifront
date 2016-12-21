import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';
import { browserHistory } from 'react-router';
import { Field, SubmissionError } from 'redux-form';
import { AuthFormField } from '../../../forms/fields';

class SignInForm extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        nextPathname: PropTypes.string
      })
    }).isRequired,
    signIn: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    valid: PropTypes.bool,
    error: PropTypes.node,
    fieldErrors: PropTypes.shape({
      username: PropTypes.array,
      password: PropTypes.array
    })
  };

  static contextTypes = {
    router: PropTypes.object
  };

  onSubmit = values => {
    const { signIn, location } = this.props;

    return signIn(values)
      .then(user => {
        if (location.state && location.state.nextPathname) {
          browserHistory.replace(location.state.nextPathname);
        } else {
          browserHistory.replace(`/id${user.id}`);
        }
      })
      .catch(error => {
        if (error.status === 401) {
          throw new SubmissionError({
            _error: 'Неверная пара логин/пароль'
          });
        }
      });
  };

  render() {
    const { handleSubmit, submitting, valid, error, pristine, fieldErrors } = this.props;

    const hasError = !valid || error;

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
          <button type="submit"
                  className={`ui fluid large teal submit ${submitting && 'loading'} button`}
                  disabled={submitting}>
            Войти
          </button>
        </div>

        {hasError && !pristine &&
          <div className="ui error message">
            <ul className="list">
              {fieldErrors.username
                  && fieldErrors.username.map(e => <li key={shortid.generate()}>{e}</li>)}
              {fieldErrors.password
                  && fieldErrors.password.map(e => <li key={shortid.generate()}>{e}</li>)}
              {error && <li>{error}</li>}
            </ul>
          </div>
        }

      </form>
    );
  }
}

export default SignInForm;
