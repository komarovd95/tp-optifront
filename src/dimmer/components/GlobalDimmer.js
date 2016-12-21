import React from 'react';


export default class GlobalDimmer extends React.Component {
  render() {
    return (
      <div className={`ui page dimmer ${this.props.active ? 'active' : ''}`}>
        <div className="ui large text loader"/>
      </div>
    );
  }
}

GlobalDimmer.propTypes = {
  active: React.PropTypes.bool.isRequired
};
