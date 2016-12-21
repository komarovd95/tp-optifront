import React, { Component, PropTypes } from 'react';


class CoverTypeEditText extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object
  };


  render() {
    const { name, label, input, meta: { error, touched } } = this.props;

    const hasError = error && touched;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <div className={`field ${hasError ? 'error' : ''}`}>
            <input type="text" id={name} {...input} />
          </div>
        </div>
      </div>
    );
  }
}

export default CoverTypeEditText;
