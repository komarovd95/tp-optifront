import React from 'react';
import ReactDOM from 'react-dom';


export default class Dropdown extends React.PureComponent {
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).dropdown({
      onChange: this.props.onChange
    });
  }

  render() {
    const { icon, defaultText, items } = this.props;

    return (
      <div className="ui floating labeled icon dropdown basic fluid button">
        <i className={`${icon} icon`}/>
        <span className="text">{defaultText}</span>
        <div className="menu">
          {items.map(item =>
            <div className="item" data-value={item.value} key={item.value}>
              {item.display}
            </div>
          )}
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  icon: React.PropTypes.string.isRequired,
  defaultText: React.PropTypes.string.isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    display: React.PropTypes.node.isRequired
  })).isRequired,
  onChange: React.PropTypes.func.isRequired
};
