import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';


class AppModal extends Component {
    static checkProps({ component, title, message }) {
        if (!(component || (title && message))) {
            throw new Error();
        }
    }

    static propTypes = {
      isOpen: PropTypes.bool.isRequired,
      component: PropTypes.element,
      title: PropTypes.node,
      message: PropTypes.node,
      accept: PropTypes.func,
      close: PropTypes.func.isRequired
    };


    state = {
      pending: false
    };

    handleAccept = () => {
        return new Promise(resolve => {
          this.setState({ pending: true });
          resolve(this.props.accept());
        }).then(() => {
          this.setState({ pending: false });
          this.handleClose();
        });
    };

    handleClose = () => {
        this.props.close();
        this.setState({ pending: false });
    };

    _render = ({ title, message }) => {
        return (
          <div className="ui small basic modal transition visible active"
               style={{ marginTop: '-120.5px', textAlign: 'center' }}>
            <i className="close icon" onClick={this.handleClose}/>
            <div className="header">
              {title}
            </div>
            <div className="content">
              {message}
            </div>
            <div className="actions" style={{ textAlign: 'center' }}>
              <div className="ui cancel red basic inverted button"
                   onClick={this.handleClose}>
                <i className="remove icon"/>
                Нет
              </div>
              <div className={`ui ok green basic inverted ${this.state.pending ? 'loading' : ''} button`}
                   onClick={this.handleAccept}>
                <i className="checkmark icon"/>
                Да
              </div>
            </div>
          </div>
        );
    };

    render() {
        const { isOpen, component, ...props } = this.props;

        if (isOpen) {
            AppModal.checkProps(this.props);
            return (
                <Modal isOpen={true}
                       onRequestClose={this.handleClose}
                       overlayClassName="ui dimmer modals page transition visible active"
                       className="ignored">
                    {component
                        ? React.cloneElement(component, {...props})
                        : this._render(this.props)
                    }
                </Modal>
            );
        } else {
            return null;
        }
    }
}

export default AppModal;
