import React, { PureComponent, PropTypes } from 'react';


class RouteAddView extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    onCancel: PropTypes.func.isRequired
  };

  render() {
    const text = this.props.type === 'node'
      ? 'Кликните в любое место на карте для создания нового перекрестка'
      : 'Соедините два перекрестка между собой';

    return (
      <div className="ui grid">
        <div className="one column row">
          <div className="column">
            <p>{text}</p>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <button className="ui fluid negative button" onClick={this.props.onCancel}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RouteAddView;
