import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Field, reduxForm } from 'redux-form';
import { fetchCars } from '../view';
import mapNormalizedToArray from '../../../utils/mapNormalizedToArray';


class RouteOptiView extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    loadCars: PropTypes.func.isRequired,
    cars: PropTypes.array.isRequired,
    valid: PropTypes.bool,
    chooseFrom: PropTypes.func.isRequired,
    chooseTo: PropTypes.func.isRequired,
    findPath: PropTypes.func.isRequired,
  };

  text = 'Выберите перекресток на карте';

  state = {
    from: null,
    to: null
  };

  componentDidMount() {
    this.props.loadCars();
  }

  handleFrom = id => {
    if (id && id !== this.state.to) {
      const old = this.state.from;
      this.setState({
        from: id
      });

      return old;
    }
  };

  handleTo = id => {
    if (id && id !== this.state.from) {
      const old = this.state.to;
      this.setState({
        to: id
      });

      return old;
    }
  };

  handleSubmit = ({ car, criteria }) => {
    if (car) {
      const carObj = this.props.cars[0];

      console.log('obj', car, this.props.cars, carObj);

      this.props.findPath(criteria, carObj, this.state.from, this.state.to);
    }
  }
  ;


  render() {
    const { pristine, handleSubmit, cars, valid, chooseFrom, chooseTo } = this.props;

    return (
      <form className="ui form" onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="field">
          <label>Автомобили</label>
          <Field name="car" component="select">
            <option value="">Автомобиль</option>
            {cars.map(car =>
              <option value={car.id} key={shortid.generate()}>
                {`${car.brandName} ${car.name} (${car.fuelTypeName})`}
              </option>
            )}
          </Field>
        </div>
        <div className="loading field">
          <label>Критерий поиска</label>
          <Field name="criteria" component="select">
            <option value="length">Протяженность</option>
            <option value="time">Длительность</option>
            <option value="cost">Стоимость</option>
          </Field>
        </div>
        <div className="field">
          <div className="ui vertical basic fluid labeled icon buttons">
            <a className="ui button" onClick={() => chooseFrom(this.handleFrom)}>
              <i className="location arrow icon"/> Пункт отправления
            </a>
            <a className="ui button" onClick={() => chooseTo(this.handleTo)}>
              <i className="crosshairs icon"/> Пункт назначения
            </a>
          </div>
        </div>
        <div className="field">
          <button className="ui basic fluid icon labeled button"
                  disabled={pristine || !valid || !this.state.from || !this.state.to}>
            <i className="search icon"/> Найти!
          </button>
        </div>
      </form>
    );
  }
}


const validate = values => {
  const errors = {};

  if (values && !values.car) {
    errors.car = {};
  }

  return errors;
};

const Form = reduxForm({
  form: 'OptiView',
  enableReinitialize: true,
  validate
})(RouteOptiView);

export default connect(
  state => ({
    cars: mapNormalizedToArray(state.cache.cars)
  }),
  dispatch => ({
    loadCars: () => dispatch(fetchCars())
  })
)(Form);
