import React, { PureComponent, PropTypes } from 'react';


class CarEditStaticText extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    input: PropTypes.object
  };


  render() {
    const { label, input } = this.props;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <p>{input.value}</p>
        </div>
      </div>
    );
  }
}

export default CarEditStaticText;
