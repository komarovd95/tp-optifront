import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { trySignIn } from '../users/auth/auth';
import Navigation from '../navigation';
import { GlobalSpinner } from '../spinner';
import Notifications from '../notifications';
import Modal from '../modal';


class App extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    trySignIn: PropTypes.func.isRequired,
    redirectToProfile: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.redirectOnIndex(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname
      && nextProps.location.pathname === '/') {
      this.redirectOnIndex(nextProps.location);
    }
  }

  redirectOnIndex = (location) => {
    const { trySignIn, redirectToProfile } = this.props;

    trySignIn().then(user => {
      if (location.pathname === '/') {
        redirectToProfile(`/id${user.id}`);
      }
    }).catch(() => {});
  };

  render() {
    return (
      <div id="app-container">
        <GlobalSpinner/>
        <Notifications/>
        <Modal/>
        <div className="nav">
          <Navigation/>
        </div>
        <div className="main">
          {this.props.children}
        </div>
      </div>
    );
  }
}


export default connect(null, dispatch => ({
  trySignIn: () => dispatch(trySignIn()),
  redirectToProfile: path => browserHistory.replace(path)
}))(App);
