import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import CarsTextFilter from './CarsTextFilter';
import CarsTypeMultipleSelect from './CarsTypeMultipleSelect';
import shortid from 'shortid';


class CarsListFilter extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    filterValues: PropTypes.object,
    brands: PropTypes.array,
    fuelTypes: PropTypes.array,
    onFilterChange: PropTypes.func,
    admin: PropTypes.bool
  };

  render() {
    const {
      handleSubmit, submitting, pristine, filterValues, brands, fuelTypes, onFilterChange, admin
    } = this.props;

    if (!filterValues) {
      return null;
    }

    return (
      <form className="ui form" onSubmit={handleSubmit(onFilterChange)}>
        <div className="three fields">
          <div className="field">
            <div className="ui labeled fluid input">
              <div className="ui label">
                <i className="search icon" style={{ margin: 0 }}/>
              </div>
              <Field name="name" placeholder="Название" component={CarsTextFilter}/>
            </div>
          </div>
          <div className="field">
            <Field name="brand" placeholder="Марка" component={CarsTypeMultipleSelect}>
              {brands.map(b =>
                <option value={b.brandName} key={shortid.generate()}>
                  {b.brandName}
                </option>)}
            </Field>
          </div>
          <div className="field">
            <Field name="fuelType" placeholder="Тип топлива" component={CarsTypeMultipleSelect}>
              {fuelTypes.map(f =>
                <option value={f.fuelTypeName} key={shortid.generate()}>
                  {f.fuelTypeName}
                </option>)}
            </Field>
          </div>
        </div>
        <div className="six fields">
          <div className="field">
            <div className="ui labeled fluid input">
              <div className="ui label">
                <i className="dashboard icon" style={{margin: 0}}/> От
              </div>
              <Field name="maxVelocityFrom"
                     component="input"
                     type="number"
                     placeholder="Скорость"
                     min={50} max={filterValues.maxVelocityTo} step={1}/>
            </div>
          </div>
          <div className="field">
            <div className="ui labeled fluid input">
              <div className="ui label">
                <i className="dashboard icon" style={{margin: 0}}/> До
              </div>
              <Field name="maxVelocityTo"
                     component="input"
                     type="number"
                     placeholder="Скорость"
                     min={filterValues.maxVelocityFrom} max={350} step={1}/>
            </div>
          </div>
          <div className="field">
            <div className="ui labeled fluid input">
              <div className="ui label">
                <i className="theme icon" style={{margin: 0}}/> От
              </div>
              <Field name="fuelConsumptionFrom"
                     component="input"
                     type="number"
                     placeholder="Расход"
                     min={1} max={filterValues.fuelConsumptionTo} step={0.1}/>
            </div>
          </div>
          <div className="field">
            <div className="ui labeled fluid input">
              <div className="ui label">
                <i className="theme icon" style={{margin: 0}}/> До
              </div>
              <Field name="fuelConsumptionTo"
                     component="input"
                     type="number"
                     placeholder="Расход"
                     min={filterValues.fuelConsumptionFrom} max={30} step={0.1}/>
            </div>
          </div>
          {(!admin) && (
            <div className="field">
              <div className="ui checkbox" style={{ padding: '0.5rem' }}>
                <Field name="onlyMine" component="input" type="checkbox"/>
                <label>Только мои</label>
              </div>
            </div>
          )}
          <div className="field">
            <button className={`ui basic fluid ${submitting ? 'loading' : ''} button`}
                    disabled={submitting || pristine}>
              <i className="filter icon"/> Применить
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'CarsListFilter',
  enableReinitialize: true
})(CarsListFilter);
