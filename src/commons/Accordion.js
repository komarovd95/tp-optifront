import React from 'react';
import ReactDOM from 'react-dom';


export default class Accordion extends React.PureComponent {
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).accordion();
  }

  render() {
    return (
      <div className={`ui ${this.props.className} accordion`}>
        {this.props.children}
      </div>
    );
  }
}

Accordion.propTypes = {
  className: React.PropTypes.string
};
