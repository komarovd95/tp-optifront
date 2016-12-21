import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import { browserHistory } from 'react-router';
import shortid from 'shortid';
import FuelTypeEditText from './FuelTypeEditText';
import FuelTypeEditNumber from './FuelTypeEditNumber';


class FuelTypeEditForm extends Component {
  static propTypes = {
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    loadFuelType: PropTypes.func.isRequired,
    resetFuelType: PropTypes.func.isRequired,
    params: PropTypes.shape({
      fuelTypeId: PropTypes.string
    }).isRequired,
    saveFuelType: PropTypes.func.isRequired,
    deleteFuelType: PropTypes.func.isRequired
  };


  componentWillMount() {
    if (this.props.params.fuelTypeId) {
      this.fuelTypeId = this.props.params.fuelTypeId;
    } else {
      this.fuelTypeId = 'new';
    }
  }

  componentDidMount() {
    this.props.loadFuelType(this.fuelTypeId);
  }

  componentWillUnmount() {
    this.props.resetFuelType();
  }

  handleSubmit = values => this.props.saveFuelType(this.fuelTypeId, values)
    .then(() => browserHistory.goBack())
    .catch(() => {});

  render() {
    const {
      handleSubmit, pristine, submitting, asyncValidating, formErrors, error, deleteFuelType
    } = this.props;

    let errors = [];

    if (formErrors) {
      errors = Object.keys(formErrors)
        .map(key => formErrors[key])
        .filter(e => e)
        .reduce((arr, e) => arr.concat(e), []);
    }

    if (error) {
      errors.push(error);
    }

    const loading = submitting || asyncValidating;

    return (
      <div className="ui padded grid">
        <div className="one center aligned column row">
          <div className="column">
            <h3 className="ui icon header">
              <i className="configure icon"/>
              <div className="content">
                {this.fuelTypeId === 'new' ? 'Создать' : 'Редактировать'} тип топлива
              </div>
            </h3>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <form className={`ui middle aligned ${errors.length > 0 ? 'error' : ''} form grid`}
                  onSubmit={handleSubmit(this.handleSubmit)}>

              <Field name="fuelTypeName" label="Тип топлива" component={FuelTypeEditText}/>
              <Field name="cost" label="Цена" component={FuelTypeEditNumber}
                     min={1} max={300} step={0.01}/>

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
                  <button className={`ui positive ${loading ? 'loading' : ''} button`}
                          disabled={loading || pristine || errors.length > 0}>
                    Сохранить
                  </button>
                </div>
                <div className="eight wide column">
                  {(this.fuelTypeId !== 'new') && (
                    <a className="ui negative button" onClick={deleteFuelType}>
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

export default FuelTypeEditForm;
