import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { PathUser } from '../../users/model';
import {LAW_ABIDING} from "../../users/constants";


class ProfileSideBar extends Component {
  static propTypes = {
    user: PropTypes.instanceOf(PathUser),
    isEditable: PropTypes.bool
  };

  createRoute = subRoute =>
    `/id${this.props.user.id}${subRoute ? '/' + subRoute  : ''}`;

  render() {
    const { user, isEditable } = this.props;

    if (user) {
      return (
        <div id="profile-sidebar" className="ui vertical menu">
          <div className="item">
            <h3 className="ui header">
              <i className="violet user icon"/>
              <div className="content">
                <Link to={this.createRoute()}>
                  {user.username}
                </Link>
                <div className="sub header">
                  {user.driveStyle === LAW_ABIDING ?
                    (
                      <p className="law-abiding">
                        <i className="law icon"/> {user.driveStyle}
                      </p>
                    ) :
                    (
                      <p className="violator">
                        <i className="bomb icon"/> {user.driveStyle}
                      </p>
                    )
                  }
                  {user.isAdmin() && (
                    <p>
                      <i className="diamond icon"/> {user.roles}
                    </p>
                  )}
                  {isEditable && (
                    <p>
                      <Link to={this.createRoute('edit')}>
                        <i className="settings icon"/> Редактировать
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </h3>
          </div>
          <Link to={this.createRoute('routes')} className="item">
            <i className="road icon"/> Мои Маршруты
          </Link>
          <Link to={this.createRoute('cars')} className="item">
            <i className="car icon"/> Мои Автомобили
          </Link>
          {user.isAdmin() && (
            <div className="item">
              <div className="header">
                АДМИНИСТРИРОВАНИЕ
              </div>
              <div className="menu">
                <Link to="/admin/users" className="item">
                  <i className="users icon"/> Пользователи
                </Link>
                <Link to="/admin/routes" className="item">
                  <i className="road icon"/> Маршруты
                </Link>
                <Link to="/admin/cars" className="item">
                  <i className="car icon"/> Автомобили
                </Link>
                <Link to="/admin/brands" className="item">
                  <i className="trademark icon"/> Марки авто
                </Link>
                <Link to="/admin/fuelTypes" className="item">
                  <i className="theme icon"/> Типы топлива
                </Link>
                <Link to="/admin/streets" className="item">
                  <i className="map signs icon"/> Названия улиц
                </Link>
                <Link to="/admin/coverTypes" className="item">
                  <i className="protect icon"/> Типы покрытий
                </Link>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ProfileSideBar;
