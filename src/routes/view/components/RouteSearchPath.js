import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import {validateField} from "../../../forms/actions";
import mapNormalizedToArray from "../../../utils/mapNormalizedToArray";
import { find } from '../path';


class RouteSearchPath extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    chooseFrom: PropTypes.func.isRequired,
    chooseTo: PropTypes.func.isRequired,
    cars: PropTypes.array.isRequired,
    pristine: PropTypes.bool,
    valid: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.string,
    find: PropTypes.func.isRequired,
    cost: PropTypes.number
  };


  handleSubmit = values => {
    this.props.find({
      car: this.props.cars.find(c => c.id == values.car),
      criteria: values.criteria || 'length'
    });
  };


  render() {
    const { handleSubmit, cars, chooseFrom, chooseTo, pristine, valid, from, to, cost } = this.props;

    return (
      <div className="ui raised segment route-settings">
        <h4>Поиск оптимального маршрута</h4>
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
            <div className="fluid ui vertical buttons">
              <a className={`ui ${from ? 'blue' : ''} button`} onClick={chooseFrom}>
                <i className="location arrow icon"/> Пункт отправления
              </a>
              <a className={`ui ${to ? 'red' : ''} button`} onClick={chooseTo}>
                <i className="crosshairs icon"/> Пункт назначения
              </a>
            </div>
          </div>
          <div className="field">
            <button className="ui basic fluid icon labeled button"
                    disabled={pristine || !valid || !from || !to}>
              <i className="search icon"/> Найти!
            </button>
          </div>
        </form>
        <h5>Стоимость пути: {cost}</h5>
      </div>
    );
  }
}


const validate = values => {
  if (!values) {
    return {};
  }

  const { car } = values;

  return {
    car: validateField(car, {
      required: {
        message: 'Выберите автомобиль'
      }
    })
  };
};


const Form = reduxForm({
  form: 'SearchForm',
  validate
})(RouteSearchPath);

export default connect(
  state => ({
    cars: mapNormalizedToArray(state.cache.cars),
    from: state.routes.view.path.from,
    to: state.routes.view.path.to,
    cost: state.routes.view.path.path && state.routes.view.path.path.cost
  }),
  dispatch => ({
    find: values => dispatch(find(values))
  })
)(Form);
