import React from 'react';


export default class RangeInput extends React.PureComponent {
  static RANGE = /^(([+-]?\d+[.\d+]?)(\s*-\s*([+-]?\d+[.\d+]?))?)|((([<>]=?)|<>)([+-]?\d+[.\d+]?))$/g;

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;

    this.props.onChange(value.split(',').map(v => v.trim()).map(v => v.match(RangeInput.RANGE))
      .filter(v => v).map(v => v[0]));
  }

  render() {
    const { placeholder } = this.props;

    return (
      <input type="text"
             placeholder={(placeholder ? placeholder + " " : "") + "(напр. 3,1-5,>15)"}
             onChange={this.handleChange}/>
    );
  }
}

RangeInput.propTypes = {
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
};
