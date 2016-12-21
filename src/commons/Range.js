import React from 'react';
import ReactDOM from 'react-dom';


export default class Range extends React.PureComponent {
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).range({
      min: 0,
      max: 10,
      start: 5
    });
  }

  render() {
    return (
      <div className="ui range"/>
    );
  }
}
