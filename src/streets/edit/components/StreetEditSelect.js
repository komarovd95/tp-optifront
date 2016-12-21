import React, { Component, PropTypes } from 'react';


class StreetEditNumber extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.array,
    input: PropTypes.object,
    label: PropTypes.string
  };

  componentDidMount() {
    $(this.refs[this.props.name]).dropdown();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.input.value === '' && nextProps.input.value !== '') {
      $(this.refs[this.props.name]).dropdown('set text', nextProps.input.value);
    }
  }

  render() {
    const { name, label, input, children: options } = this.props;

    return (
      <div className="row">
        <div className="eight wide column"
             style={{textAlign: 'right', fontWeight: 600}}>
          <label>{label}</label>
        </div>
        <div className="eight wide column">
          <select {...input} id={name} ref={name}
                  className="ui fluid selection dropdown">
            {options}
          </select>
        </div>
      </div>
    );
  }
}

export default StreetEditNumber;

