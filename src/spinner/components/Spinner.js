import React, { Component, PropTypes } from 'react';


class Spinner extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    message: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    message: 'Загрузка данных...',
    className: ''
  };

  render() {
    const { active, message, className } = this.props;

    if (active) {
      return (
        <div className={`ui active ${className} dimmer`}>
          <div className="ui text loader">
            {message}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Spinner;
