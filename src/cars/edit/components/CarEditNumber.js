import React, { Component, PropTypes } from 'react';


class CarEditNumber extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    input: PropTypes.object,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number
  };


  render() {
    const { name, label, input, min, max, step } = this.props;

    const hasError = false;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <div className={`field ${hasError ? 'error' : ''}`}>
            <input type="number" id={name} min={min} max={max} step={step} {...input}/>
          </div>
        </div>
      </div>
    );
  }
}

export default CarEditNumber;
