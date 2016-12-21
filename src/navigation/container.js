import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import NavLinks from './components/NavLinks';
import NavRight from './components/NavRight';
import { PathUser } from '../users/model';
import { signOut } from '../users/auth/auth';


class Navigation extends Component {
  static propTypes = {
    user: PropTypes.instanceOf(PathUser),
    signOut: PropTypes.func.isRequired
  };

  render() {
    return (
      <nav id="main" className="ui inverted borderless menu">
        <div className="ui fluid container">
          <NavLinks/>
          <NavRight user={this.props.user} signOut={this.props.signOut}/>
        </div>
      </nav>
    );
  }
}

export default connect(
  state => ({ user: state.auth.user }),
  dispatch => ({ signOut: () => dispatch(signOut())})
)(Navigation);
