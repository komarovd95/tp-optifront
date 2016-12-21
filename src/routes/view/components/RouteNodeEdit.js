import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { updateNode, removeNode } from '../manipulation';


class RouteNodeEdit extends Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    hasLight: PropTypes.bool,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool
  };


  handleSubmit = ({ hasLight, redPhase, greenPhase }) => {
    const { onUpdate, onCancel, node } = this.props;

    onUpdate({
      id: node.id,
      x: node.x,
      y: node.y,
      light: hasLight ? { redPhase, greenPhase } : null
    });

    onCancel();
  };

  handleRemove = () => {
    this.props.onRemove(this.props.node);
    this.props.onCancel();
  };


  render() {
    const { pristine, handleSubmit, hasLight, onCancel } = this.props;

    return (
      <div className="ui raised segment route-edit-form">
        <h4>Редактирование перекрестка</h4>
        <form className="ui form" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="field">
            <div className="ui checkbox">
              <Field name="hasLight" component="input" type="checkbox"/>
              <label>Регулируемый</label>
            </div>
          </div>
          <div className="field">
            <label>Длительность красной фазы</label>
            <Field name="redPhase" component="input" type="number"
                   min={15} max={150} step={1}
                   disabled={!hasLight}/>
          </div>
          <div className="field">
            <label>Длительность зеленой фазы</label>
            <Field name="greenPhase" component="input" type="number"
                   min={15} max={120} step={1}
                   disabled={!hasLight}/>
          </div>
          <div className="fluid ui buttons">
            <button className="ui primary button" disabled={pristine}>Сохранить</button>
            <a className="ui negative button" onClick={this.handleRemove}>Удалить</a>
            <a className="ui button" onClick={onCancel}>Отмена</a>
          </div>
        </form>
      </div>
    );
  }
}


const NodeEditForm = reduxForm({
  form: 'NodeEditForm',
  enableReinitialize: true
})(RouteNodeEdit);


const selector = formValueSelector('NodeEditForm');

export default connect(
  (state, { node }) => ({
    initialValues: {
      id: node.id,
      hasLight: !!node.light,
      redPhase: node.light ? node.light.redPhase : 15,
      greenPhase: node.light ? node.light.greenPhase : 15
    },
    hasLight: selector(state, 'hasLight')
  }),
  dispatch => ({
    onUpdate: node => dispatch(updateNode(node)),
    onRemove: node => dispatch(removeNode(node))
  })
)(NodeEditForm);
