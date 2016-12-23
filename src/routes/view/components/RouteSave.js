import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { validateField } from '../../../forms/actions';
import { unique, save } from '../view';
import shortid from 'shortid';


class RouteSave extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    handleSubmit: PropTypes.func.isRequired
  };

  handleSubmit = ({ name }) => this.props.onSave(name).then(() => this.props.onCancel());

  render() {
    const { onCancel, formErrors, error, asyncValidating, handleSubmit } = this.props;

    let errors = [];
    if (formErrors && formErrors.name) {
      errors = errors.concat(formErrors.name);
    }

    if (error) {
      errors.push(error);
    }

    return (
      <div className="ui raised segment route-info-panel">
        <form className={`ui ${errors.length > 0 ? 'error' : ''} ${asyncValidating && 'loading'} form`}
              onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="field">
            <label>Имя маршрута</label>
            <Field name="name" component="input" type="text"/>
          </div>
          <div className="ui error message">
            <ul className="list">
              {errors.map(e => <li key={shortid.generate()}>{e}</li>)}
            </ul>
          </div>
          <div className="fluid ui basic buttons">
            <button className="ui primary button">
              Сохранить
            </button>
            <a className="ui negative button" onClick={onCancel}>
              Отмена
            </a>
          </div>
        </form>
      </div>
    );
  }
}


const validate = values => {
  if (!values) {
    return {};
  }

  const { name } = values;
  return {
    name: validateField(name, {
      required: {
        message: 'Введите название маршрута'
      },
      minLength: {
        val: 1,
        message: 'Название маршрута должно содержать хотя бы 1 символ'
      },
      maxLength: {
        val: 50,
        message: 'Название маршрута не может содержать больше 50 символов'
      },
      pattern: {
        val: /^[a-zA-Z0-9\sа-яА-Я\-]+$/,
        message: 'В названии допускаются только русские и латинские буквы, цифры и дефис'
      }
    })
  };
};


const asyncValidate = (values, dispatch) => dispatch(unique(values.name));


const Form = reduxForm({
  form: 'RouteSaveForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['name']
})(RouteSave);


const getFormErrors = getFormSyncErrors('RouteSaveForm');

export default connect(
  state => ({
    initialValues: {
      name: state.routes.view.route.fetched && state.routes.view.route.fetched.name || 'Без названия'
    },
    formErrors: getFormErrors(state)
  }),
  dispatch => ({
    onSave: name => dispatch(save(name))
  })
)(Form);
