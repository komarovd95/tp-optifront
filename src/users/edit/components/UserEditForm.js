import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import { LAW_ABIDING, VIOLATOR, USER, ADMIN } from '../../constants';
import UserEditSelect from './UserEditSelect';
import UserEditPassword from './UserEditPassword';
import { browserHistory } from 'react-router';
import shortid from 'shortid';


class UserEditForm extends Component {
  static propTypes = {
    isUserCouldBeDeleted: PropTypes.bool,
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    deleteUser: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    changeUser: PropTypes.func.isRequired
  };

  handleSubmit = values => this.props.changeUser(values).then(() => browserHistory.goBack());

  render() {
    const {
      isUserCouldBeDeleted, handleSubmit, pristine, submitting, formErrors, deleteUser
    } = this.props;

    let errors = [];

    if (formErrors && formErrors.password) {
      errors = errors.concat(formErrors.password);
    }

    if (formErrors && formErrors.repeatPassword) {
      errors = errors.concat(formErrors.repeatPassword);
    }

    return (
      <div className="ui padded grid">
        <div className="one center aligned column row">
          <div className="column">
            <h3 className="ui icon header">
              <i className="settings icon"/>
              <div className="content">
                Настройки аккаунта
              </div>
            </h3>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <form className={`ui middle aligned ${errors.length > 0 ? 'error' : ''} form grid`}
                  onSubmit={handleSubmit(this.handleSubmit)}>
              <Field name="driveStyle" label="Стиль вождения" component={UserEditSelect}>
                <option value="">Стиль вождения</option>
                <option value={LAW_ABIDING}>{LAW_ABIDING}</option>
                <option value={VIOLATOR}>{VIOLATOR}</option>
              </Field>
              {isUserCouldBeDeleted && (
                <Field name="roles" label="Роль" component={UserEditSelect}>
                  <option value="">Роль пользователя</option>
                  <option value={USER}>{USER}</option>
                  <option value={ADMIN}>{ADMIN}</option>
                </Field>
              )}
              <Field name="password" label="Новый пароль" component={UserEditPassword}/>
              <Field name="repeatPassword" label="Повторите пароль" component={UserEditPassword}/>

              <div className="row">
                <div className="eight wide column"/>
                <div className="eight wide column">
                  <div className="ui error message">
                    <ul className="list">
                      {errors.map(e => <li key={shortid.generate()}>{e}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="eight wide column" style={{ textAlign: 'right' }}>
                  <button className={`ui positive ${submitting ? 'loading' : ''} button`}
                          disabled={submitting || pristine}>
                    Сохранить
                  </button>
                </div>
                <div className="eight wide column">
                  {isUserCouldBeDeleted && (
                    <a className="ui negative button" onClick={deleteUser}>
                      Удалить
                    </a>
                  )}
                  <a className="ui button" onClick={() => browserHistory.goBack()}>
                    Отмена
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default UserEditForm;
