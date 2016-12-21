import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


class Animation extends Component {
  static propTypes = {
    name: PropTypes.string,
    timeout: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired
  };

  static defaultProps = {
    name: "fade-in",
    timeout: 500
  };


  render() {
    const { name, timeout, children } = this.props;

    return (
      <ReactCSSTransitionGroup component="div"
                               className="animation"
                               transitionAppear={true}
                               transitionAppearTimeout={timeout}
                               transitionName={name}
                               transitionEnterTimeout={timeout}
                               transitionLeaveTimeout={timeout}>
        {children}
      </ReactCSSTransitionGroup>
    );
  }
}


export default Animation;
