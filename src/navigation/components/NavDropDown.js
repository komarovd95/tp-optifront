import React, { PureComponent, PropTypes } from 'react';
import { browserHistory } from 'react-router';


class NavDropDown extends PureComponent {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      username: PropTypes.string.isRequired
    }).isRequired,
    signOut: PropTypes.func.isRequired
  };

  componentDidMount() {
    $(this.refs.dropdown).dropdown({
      on: 'hover'
    });
  }

  handleProfileClick = () => {
    browserHistory.push(`/id${this.props.user.id}`);
  };

  handleSignOut = () => {
    this.props.signOut()
      .then(() => browserHistory.replace('/'))
      .catch(() => browserHistory.replace('/'));
  };

  render() {
    return (
      <div className="right menu">
        <div id="nav-right" className="ui dropdown item" ref="dropdown"
             onClick={this.handleProfileClick}>
          <i className="user icon"/> {this.props.user.username} <i className="dropdown icon"/>
          <div className="menu">
            <div className="item">Мои маршруты</div>
            <div className="item">Мои автомобили</div>
            <div className="divider"/>
            <div className="header">Администрирование</div>
            <div className="item">Link Itemdfsd</div>
          </div>
        </div>
        <a className="item" onClick={this.handleSignOut}>
          Выйти
        </a>
      </div>
    );
  }
}

export default NavDropDown;
