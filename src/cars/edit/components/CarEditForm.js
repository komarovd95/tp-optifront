import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import CarEditSelect from './CarEditSelect';
import CarEditText from './CarEditText';
import CarEditNumber from './CarEditNumber';
import CarEditStaticText from './CarEditStaticText';
import { browserHistory } from 'react-router';
import shortid from 'shortid';


class CarEditForm extends Component {
  static propTypes = {
    formErrors: PropTypes.object,
    handleSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    asyncValidating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    brands: PropTypes.array,
    fuelTypes: PropTypes.array,
    loadCaches: PropTypes.func.isRequired,
    loadCar: PropTypes.func.isRequired,
    resetCar: PropTypes.func.isRequired,
    params: PropTypes.shape({
      carId: PropTypes.string
    }).isRequired,
    saveCar: PropTypes.func.isRequired,
    deleteCar: PropTypes.func.isRequired
  };


  componentWillMount() {
    if (this.props.params.carId) {
      this.carId = this.props.params.carId;
    } else {
      this.carId = 'new';
    }
  }

  componentDidMount() {
    this.props.loadCaches()
      .then(() => this.props.loadCar(this.carId));
  }

  componentWillUnmount() {
    this.props.resetCar();
  }

  handleSubmit = values => this.props.saveCar(this.carId, values)
    .then(() => browserHistory.goBack())
    .catch(() => {});

  render() {
    const {
      handleSubmit, pristine, submitting, asyncValidating, formErrors, brands, fuelTypes, isLoading,
      error, deleteCar
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
                {this.carId === 'new' ? 'Создать' : 'Редактировать'} автомобиль
              </div>
            </h3>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <form className={`ui middle aligned ${errors.length > 0 ? 'error' : ''} ${isLoading ? 'loading' : ''} form grid`}
                  onSubmit={handleSubmit(this.handleSubmit)}>
              <Field name="brandName" label="Марка"
                     component={this.carId === 'new' ? CarEditSelect : CarEditStaticText}>
                <option value="">Марка</option>
                {brands.map(brand =>
                  <option value={brand.brandName} key={brand.brandName}>
                    {brand.brandName}
                  </option>
                )}
              </Field>
              <Field name="fuelTypeName" label="Тип топлива"
                     component={this.carId === 'new' ? CarEditSelect : CarEditStaticText}>
                <option value="">Тип топлива</option>
                {fuelTypes.map(fuelType =>
                  <option value={fuelType.fuelTypeName} key={shortid.generate()}>
                    {fuelType.fuelTypeName}
                  </option>
                )}
              </Field>
              <Field name="name" label="Модель"
                     component={this.carId === 'new' ? CarEditText : CarEditStaticText}/>
              <Field name="fuelConsumption" label="Расход" component={CarEditNumber}
                     min={1.0} max={30.0} step={0.1}/>
              <Field name="maxVelocity" label="Макс. скорость" component={CarEditNumber}
                     min={50} max={350} step={1}/>

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
                  {(this.carId !== 'new') && (
                    <a className="ui negative button" onClick={deleteCar}>
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

export default CarEditForm;
