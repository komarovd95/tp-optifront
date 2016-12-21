import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, withRouter } from 'react-router';
import { trySignIn } from '../auth';


export default (WrappedComponent, accessDenied = (s => u => false)) => {
  class SecuredComponent extends Component {
    static propTypes = {
      trySignIn: PropTypes.func.isRequired,
      accessDenied: PropTypes.func.isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      signedIn: PropTypes.bool
    };

    componentWillMount() {
      const { location, trySignIn, accessDenied } = this.props;

      trySignIn()
        .then(user => {
          if (accessDenied(user)) {
            browserHistory.replace('/401');
          }
        })
        .catch(() => browserHistory.replace({
          pathname: '/signin',
          state: {
            nextPathname: location.pathname
          }
        }));
    }

    render() {
      const { signedIn, ...rest } = this.props;

      if (signedIn) {
        return (
          <WrappedComponent {...rest}/>
        );
      } else {
        return null;
      }
    }
  }

  return connect(
    state => ({
      signedIn: !!state.auth.user,
      accessDenied: accessDenied(state)
    }),
    dispatch => ({ trySignIn: () => dispatch(trySignIn()) })
  )(withRouter(SecuredComponent));
};
