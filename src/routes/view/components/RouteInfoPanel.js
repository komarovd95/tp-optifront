import React, { PureComponent, PropTypes } from 'react';


class RouteInfoPanel extends PureComponent {
  static propTypes = {
    message: PropTypes.string.isRequired,
    onDecline: PropTypes.func.isRequired
  };


  render() {
    const { message, onDecline } = this.props;

    return (
      <div className="ui raised segment route-info-panel">
        <p>{message}</p>
        <button className="ui negative button" onClick={onDecline}>
          Отмена
        </button>
      </div>
    );
  }
}

export default RouteInfoPanel;
