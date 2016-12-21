import React from 'react';


export default class Spinner extends React.PureComponent {
  render() {
    const { active, inverted, text } = this.props;

    if (active) {
      return (
        <div className={`ui active ${inverted ? 'inverted' : ''} dimmer`}>
          <div className="ui text loader">
            {text}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

Spinner.propTypes = {
  active: React.PropTypes.bool.isRequired,
  inverted: React.PropTypes.bool,
  text: React.PropTypes.node
};

Spinner.defaultProps = {
  inverted: true,
  text: 'Загрузка данных...'
};
