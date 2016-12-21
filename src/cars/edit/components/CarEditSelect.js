import React, { Component, PropTypes } from 'react';


class CarEditSelect extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.array,
    input: PropTypes.object,
    label: PropTypes.string,
    disabled: PropTypes.bool
  };

  componentDidMount() {
    $(this.refs[this.props.name]).dropdown();
  }

  render() {
    const { name, label, disabled, input, children: options } = this.props;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <select {...input} id={name} ref={name}
                  className="ui fluid selection dropdown" disabled={disabled} >
            {options}
          </select>
        </div>
      </div>
    );
  }
}

export default CarEditSelect;
