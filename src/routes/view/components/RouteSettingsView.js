import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { saveSettings } from '../view';


class RouteEdgeEditView extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    saveSettings: PropTypes.func.isRequired
  };

  render() {
    const { pristine, handleSubmit, saveSettings } = this.props;

    return (
      <form className="ui form" onSubmit={handleSubmit(saveSettings)}>
        <div className="field">
          <div className="ui checkbox">
            <Field name="lights" component="input" type="checkbox"/>
            <label>Отображать светофоры</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="scaleNodes" component="input" type="checkbox"/>
            <label>Масштабировать перекрестки</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="scaleEdges" component="input" type="checkbox"/>
            <label>Масштабировать участки дорог</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="length" component="input" type="checkbox"/>
            <label>Отображать длину</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="coverTypes" component="input" type="checkbox"/>
            <label>Отображать тип покрытия</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="streetNames" component="input" type="checkbox"/>
            <label>Отображать названия улиц</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="limits" component="input" type="checkbox"/>
            <label>Отображать ограничения скорости</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="traffic" component="input" type="checkbox"/>
            <label>Отображать пробки</label>
          </div>
        </div>
        <div className="field">
          <div className="ui checkbox">
            <Field name="police" component="input" type="checkbox"/>
            <label>Отображать патрульных</label>
          </div>
        </div>
        <div className="field">
          <button className="ui primary basic fluid button" disabled={pristine}>
            Сохранить
          </button>
        </div>
      </form>
    );
  }
}

const Form = reduxForm({
  form: 'SettingsView',
  enableReinitialize: true
})(RouteEdgeEditView);


export default connect(
  state => ({
    initialValues: state.routes.view.settings
  }),
  dispatch => ({
    saveSettings: values => dispatch(saveSettings(values))
  })
)(Form);

