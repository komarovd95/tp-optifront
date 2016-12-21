import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';


class RouteNodeEditView extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    resetCallback: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    hasLight: PropTypes.bool,
    nodeSave: PropTypes.func.isRequired,
    nodeDelete: PropTypes.func.isRequired,
  };


  handleReset = () => {
    this.props.reset();
    this.props.resetCallback();
  };

  render() {
    const { pristine, handleSubmit, hasLight, nodeSave, nodeDelete } = this.props;

    return (
      <form className="ui form" onSubmit={handleSubmit(nodeSave)}>
        <div className="field">
          <div className="ui checkbox">
            <Field name="hasLight" component="input" type="checkbox"/>
            <label>Регулируемый</label>
          </div>
        </div>
        <div className="field">
          <label>Длительность красной фазы</label>
          <Field name="redPhase" component="input" type="number" min={15} max={150} step={1}
                 disabled={!hasLight}/>
        </div>
        <div className="field">
          <label>Длительность зеленой фазы</label>
          <Field name="greenPhase" component="input" type="number" min={15} max={120} step={1}
                 disabled={!hasLight}/>
        </div>
        <div className="field">
          <div className="ui three basic vertical fluid buttons">
            <button className="ui button" disabled={pristine}>Сохранить</button>
            <a className="ui button" onClick={nodeDelete}>Удалить</a>
            <a className="ui button" onClick={this.handleReset}>Отмена</a>
          </div>
        </div>
      </form>
    );
  }
}

const Form = reduxForm({
  form: 'NodeEditView',
  enableReinitialize: true
})(RouteNodeEditView);

const selector = formValueSelector("NodeEditView");

export default connect((state, ownProps) => {
  const { node } = ownProps;

  const initialValues = {
    id: node.id,
    hasLight: !!node.light,
    redPhase: node.light ? node.light.redPhase : 15,
    greenPhase: node.light ? node.light.greenPhase : 15
  };

  return {
    initialValues,
    hasLight: selector(state, 'hasLight')
  };
})(Form);
