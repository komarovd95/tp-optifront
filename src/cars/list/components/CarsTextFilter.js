import React, { Component, PropTypes } from 'react';


class CarsTextFilter extends Component {
  static propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    input: PropTypes.object
  };

  render() {
    const { name, placeholder, input } = this.props;

    return (
      <input type="text" className="" name={name} placeholder={placeholder} {...input}/>
    );
  }
}

export default CarsTextFilter;
