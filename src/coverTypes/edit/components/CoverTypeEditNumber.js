import React, { Component, PropTypes } from 'react';


class CoverTypeEditNumber extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number
  };


  render() {
    const { name, label, input, meta: { error, touched }, min, max, step } = this.props;

    const hasError = error && touched;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <div className={`field ${hasError ? 'error' : ''}`}>
            <input type="number" id={name} min={min} max={max} step={step} {...input} />
          </div>
        </div>
      </div>
    );
  }
}

export default CoverTypeEditNumber;

