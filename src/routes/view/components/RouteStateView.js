import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as policemen from '../model';


class RouteStateView extends Component {
  static propTypes = {
    edge: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    stateSave: PropTypes.func.isRequired,
    limit: PropTypes.number
  };

  render() {
    const { pristine, handleSubmit, stateSave, limit } = this.props;

    return (
      <form className="ui form" onSubmit={handleSubmit(stateSave)}>
        <div className="field">
          <label>Патрульный</label>
          <Field name="policeman" component="select">
            <option value="">Отсутствует</option>
            <option value={policemen.greedyPoliceman.name}>Жадный</option>
            <option value={policemen.honestPoliceman.name}>Честный</option>
            <option value={policemen.slowPoliceman.name}>Медлительный</option>
          </Field>
        </div>
        <div className="field">
          <label>Пробка (км/ч)</label>
          <Field name="traffic" component="input" type="number" min={0} max={limit} step={1}/>
        </div>
        <div className="field">
          <button className="ui basic fluid button" disabled={pristine}>
            Сохранить
          </button>
        </div>
      </form>
    );
  }
}

const Form = reduxForm({
  form: 'StateEditView',
  enableReinitialize: true
})(RouteStateView);

export default connect((state, ownProps) => {
  const { edge } = ownProps;

  const initialValues = {
    id: edge.id,
    policeman: edge.policeman,
    traffic: edge.traffic || edge.limit || 60
  };

  return {
    initialValues,
    limit: edge.limit || 60
  };
})(Form);
