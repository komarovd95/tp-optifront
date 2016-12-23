import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { undo, redo } from '../manipulation';


class RouteUndoToolbar extends PureComponent {
  static propTypes = {
    canUndo: PropTypes.bool,
    canRedo: PropTypes.bool,
    disabled: PropTypes.bool,
    onSaveClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    onAddNodeClick: PropTypes.func.isRequired,
    onAddEdgeClick: PropTypes.func.isRequired,
    onPathClick: PropTypes.func.isRequired,
    onSettingsClick: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired
  };


  render() {
    const {
      canUndo, canRedo, disabled,
      onSaveClick, onDeleteClick, onAddNodeClick, onAddEdgeClick, onSettingsClick, onUndo, onRedo,
      onPathClick
    } = this.props;

    return (
      <div className="ui raised segment route-undo-toolbar">
        <div className="fluid ui big buttons">
          <button className={`ui icon ${(!canUndo || disabled) ? 'disabled' : ''} button`}
                  onClick={onUndo}
                  data-tooltip="Отменить действие"
                  data-position="bottom left">
            <i className="reply icon"/>
          </button>
          <button className={`ui icon ${(!canRedo || disabled) ? 'disabled' : ''} button`}
                  onClick={onRedo}
                  data-tooltip="Повторить действие"
                  data-position="bottom left">
            <i className="share icon"/>
          </button>
          <button className={`ui icon ${disabled ? 'disabled' : ''} button`}
                  onClick={onAddNodeClick}
                  data-tooltip="Добавить перекресток на карту"
                  data-position="bottom left">
            <i className="bullseye icon"/>
          </button>
          <button className={`ui icon ${disabled ? 'disabled' : ''} button`}
                  onClick={onAddEdgeClick}
                  data-tooltip="Добавить участок дороги на карту на карту"
                  data-position="bottom left">
            <i className="road icon"/>
          </button>
          <button className={`ui icon ${disabled ? 'disabled' : ''} button`}
                  onClick={onPathClick}
                  data-tooltip="Найти оптимальный маршрут"
                  data-position="bottom left">
            <i className="share alternate icon"/>
          </button>
          <button className={`ui icon ${disabled ? 'disabled' : ''} button`}
                  onClick={onSettingsClick}
                  data-tooltip="Настройки карты"
                  data-position="bottom left">
            <i className="settings icon"/>
          </button>
          <button className={`ui icon ${disabled ? 'disabled' : ''} button`}
                  onClick={onDeleteClick}
                  data-tooltip="Удалить карту"
                  data-position="bottom left">
            <i className="remove circle icon"/>
          </button>
          <button className={`ui icon ${(!canUndo || disabled) ? 'disabled' : ''} button`}
                  onClick={onSaveClick}
                  data-tooltip="Сохранить карту"
                  data-position="bottom left">
            <i className="save icon"/>
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    canUndo: state.routes.view.manipulation.past.length > 0,
    canRedo: state.routes.view.manipulation.future.length > 0
  }),
  dispatch => ({
    onUndo: () => dispatch(undo()),
    onRedo: () => dispatch(redo())
  })
)(RouteUndoToolbar);
