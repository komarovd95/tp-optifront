import React, { Component, PropTypes } from 'react';
import NavDropDown from './NavDropDown';
import { Link } from 'react-router';
import { PathUser } from '../../users/model';


class NavRight extends Component {
  static propTypes = {
    user: PropTypes.instanceOf(PathUser),
    signOut: PropTypes.func.isRequired
  };

  render() {
    const { user, signOut } = this.props;

    if (user) {
      return (
        <NavDropDown user={user} signOut={signOut} />
      );
    } else {
      return (
        <div id="nav-right" className="right item">
          <Link to="signin" className="fluid ui teal inverted button">
            Войти
          </Link>
          <Link to="signup" className="fluid ui violet inverted button">
            Регистрация
          </Link>
        </div>
      );
    }
  }
}

export default NavRight;
