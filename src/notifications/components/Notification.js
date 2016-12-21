import React, { Component, PropTypes } from 'react';
import { Notification as ReactNotification } from 'react-notification';
import { INFO, WARN, ERROR } from '../constants';


class Notification extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
    message: PropTypes.node,
    level: PropTypes.string,
    dismiss: PropTypes.func
  };

  static defaultProps = {
    message: ''
  };

  createTitleAndColor = () => {
    switch (this.props.level) {
      case INFO:
        return ['Успешно!', 'info'];
      case WARN:
        return ['Внимание!', 'warn'];
      case ERROR:
        return ['Ошибка!', 'error'];

      default:
        return [];
    }
  };

  render() {
    const { isActive, message, dismiss } = this.props;

    const [title, color] = this.createTitleAndColor();

    return (
      <ReactNotification isActive={isActive}
                         title={title}
                         message={message}
                         onClick={dismiss}
                         onDismiss={dismiss}
                         action="закрыть"
                         activeClassName={`notification ${color}`}
                         dismissAfter={5000} />
    );
  }
}

export default Notification;
