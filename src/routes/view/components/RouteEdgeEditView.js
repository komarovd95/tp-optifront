import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Field, reduxForm } from 'redux-form';
import { getCache } from '../../../cache';
import mapNormalizedToArray from '../../../utils/mapNormalizedToArray';


class RouteEdgeEditView extends Component {
  static propTypes = {
    edge: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    resetCallback: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    streets: PropTypes.array,
    coverTypes: PropTypes.array,
    edgeSave: PropTypes.func.isRequired,
    edgeDelete: PropTypes.func.isRequired
  };


  handleReset = () => {
    this.props.reset();
    this.props.resetCallback();
  };

  handleSubmit = values => {
    const vals = { ...values };

    if (vals.coverType) {
      vals.coverType = this.props.coverTypes.find(cT => cT.coverTypeName === values.coverType);
    }

    if (vals.street) {
      vals.street = this.props.streets.find(s => s.streetName === values.street);
    }

    return this.props.edgeSave(vals);
  };

  render() {
    const { pristine, handleSubmit, streets, coverTypes, edgeDelete } = this.props;

    return (
      <form className="ui form" onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="field">
          <div className="ui checkbox">
            <Field name="directed" component="input" type="checkbox"/>
            <label>Односторонняя</label>
          </div>
        </div>
        <div className="field">
          <label>Количество полос</label>
          <Field name="lanes" component="input" type="number" min={1} max={15} step={1}/>
        </div>
        <div className="field">
          <label>Длина</label>
          <Field name="length" component="input" type="number" min={100} max={10000} step={10}/>
        </div>
        <div className="field">
          <label>Ограничение скорости</label>
          <Field name="limit" component="input" type="number" min={20} max={120} step={5}/>
        </div>
        <div className="field">
          <label>Тип покрытия</label>
          <Field name="coverType" component="select">
            <option value="">Тип покрытия</option>
            {coverTypes.map(cT =>
              <option value={cT.coverTypeName} key={shortid.generate()}>
                {`${cT.coverTypeName} (${cT.slowdown})`}
              </option>
            )}
          </Field>
        </div>
        <div className="field">
          <label>Название улицы</label>
          <Field name="street" component="select">
            <option value="">Название улицы</option>
            {streets.map(s =>
              <option value={s.streetName} key={shortid.generate()}>
                {`${s.streetType} ${s.streetName}`}
              </option>
            )}
          </Field>
        </div>
        <div className="field">
          <div className="ui three basic vertical fluid buttons">
            <button className="ui button" disabled={pristine}>Сохранить</button>
            <a className="ui button" onClick={edgeDelete}>Удалить</a>
            <a className="ui button" onClick={this.handleReset}>Отмена</a>
          </div>
        </div>
      </form>
    );
  }
}

const Form = reduxForm({
  form: 'EdgeEditView',
  enableReinitialize: true
})(RouteEdgeEditView);

const getStreetsCache = getCache('streets');
const getCoverTypesCache = getCache('coverTypes');

export default connect(
  (state, ownProps) => {
    const { edge } = ownProps;

    const initialValues = {
      id: edge.id,
      street: edge.street ? edge.street.streetName : '',
      coverType: edge.coverType ? edge.coverType.coverTypeName : '',
      directed: edge.directed,
      lanes: edge.lanes,
      length: edge.length,
      limit: edge.limit
    };

    return {
      initialValues,
      streets: mapNormalizedToArray(getStreetsCache(state)),
      coverTypes: mapNormalizedToArray(getCoverTypesCache(state))
    };
  }
)(Form);
