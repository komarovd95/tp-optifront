import React, { PureComponent, PropTypes } from 'react';


class RouteDefaultView extends PureComponent {
  static propTypes = {
    onNodeAddClick: PropTypes.func.isRequired,
    onEdgeAddClick: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="ui grid">
        <div className="one column row">
          <div className="column">
            <button className="ui fluid icon labeled button" onClick={this.props.onNodeAddClick}>
              <i className="sitemap icon"/> Добавить перекресток
            </button>
          </div>
        </div>
        <div className="one column row">
          <div className="column">
            <button className="ui fluid icon labeled button" onClick={this.props.onEdgeAddClick}>
              <i className="road icon"/> Добавить участок
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RouteDefaultView;
