import React, { Component, PropTypes } from 'react';
import MultipleSelectDropdown from '../../../commons/MultipleSelectDropdown';


class CarsTypeMultipleSelect extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    children: PropTypes.any,
    input: PropTypes.object
  };

  render() {
    const { placeholder, children, input } = this.props;

    return (
      <MultipleSelectDropdown placeholder={placeholder} input={input}>
        {children}
      </MultipleSelectDropdown>
    );
  }
}

export default CarsTypeMultipleSelect;

