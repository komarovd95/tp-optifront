import React, { Component, PropTypes } from 'react';


class CarEditText extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    input: PropTypes.object,
    disabled: PropTypes.bool,
  };


  render() {
    const { name, label, disabled, input } = this.props;

    const hasError = false;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <div className={`field ${hasError ? 'error' : ''}`}>
            <input type="text" disabled={disabled} id={name} {...input} />
          </div>
        </div>
      </div>
    );
  }
}

export default CarEditText;
