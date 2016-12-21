import React from 'react';
import ReactDOM from 'react-dom';


export default class MultipleSelectDropdown extends React.PureComponent {
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).dropdown({
      onChange: this.props.onChange,
      message: {
        noResults: 'Нет данных'
      }
    });
  }

  render() {
    const { children, placeholder, input } = this.props;

    return (
      <select className="ui fluid search dropdown" multiple {...input}>
        <option value="">{placeholder}</option>
        {children}
      </select>

    );
  }
}

MultipleSelectDropdown.propTypes = {
  placeholder: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func
};
