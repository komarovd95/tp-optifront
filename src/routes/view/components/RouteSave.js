import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { validateField } from '../../../forms/actions';
import { unique } from '../view';
import shortid from 'shortid';


class RouteSave extends Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    formErrors: PropTypes.object,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  };

  handleSubmit = ({ name }) => {
    return this.props.onCancel();
  };

  render() {
    const { onCancel, formErrors, error, asyncValidating } = this.props;

    let errors = [];
    if (formErrors && formErrors.name) {
      errors = errors.concat(formErrors.name);
    }

    if (error) {
      errors.push(error);
    }

    return (
      <div className="ui raised segment route-info-panel">
        <form className={`ui ${errors.length > 0 ? 'error' : ''} ${asyncValidating && 'loading'} form`}>
          <div className="field">
            <label>Имя маршрута</label>
            <Field name="name" component="input" type="text"/>
          </div>
          <div className="ui error message">
            <ul className="list">
              {errors.map(e => <li key={shortid.generate()}>{e}</li>)}
            </ul>
          </div>
        </form>
        <p/>
        <div className="two ui buttons">
          <button className="ui primary button">
            Сохранить
          </button>
          <button className="ui negative button" onClick={onCancel}>
            Отмена
          </button>
        </div>
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


const asyncValidate = (values, dispatch, props) => {
  if (!props.pristine) {
    return dispatch(unique(values.name));
  } else {
    return Promise.resolve();
  }
};


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
      name: 'Без названия'
    },
    formErrors: getFormErrors(state)
  })
)(Form);
