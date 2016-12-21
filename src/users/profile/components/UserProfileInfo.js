import React, { Component, PropTypes } from 'react';
import { PathUser } from '../../model';


class UserProfileInfo extends Component {
  static propTypes = {
    user: PropTypes.instanceOf(PathUser)
  };

  render() {
    const { user } = this.props;

    if (!user) {
      return null;
    }

    let cars;
    if (user.cars > 1 && user.cars < 5) {
      cars = "Автомобиля";
    } else if (user.cars === 1) {
      cars = "Автомобиль";
    } else {
      cars = "Автомобилей";
    }

    let routes;
    if (user.routes > 1 && user.routes < 5) {
      routes = "Маршрута";
    } else if (user.routes === 1) {
      routes = "Маршрут";
    } else {
      routes = "Маршрутов";
    }

    return (
      <div className="ui stackable padded grid">
        <div className="one column row">
          <div className="column">
            <h2 className="ui center aligned icon header">
              <i className="circular violet user icon"/>
              {user.username}
              <div className="sub header">
                Информация о пользователе
              </div>
            </h2>
          </div>
        </div>
        <div className="four column center aligned row">
          <div className="column">
            <div className="ui statistic">
              <div className="value">
                {user.driveStyle === 'Законопослушный'
                  ? <i className="law icon"/>
                  : <i className="bomb icon"/>
                }
              </div>
              <div className="label">
                {user.driveStyle}
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui statistic">
              <div className="value">
                {user.isAdmin() ? <i className="diamond icon"/> : <i className="users icon"/>}
              </div>
              <div className="label">
                {user.roles}
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui statistic">
              <div className="value">
                {user.cars}
              </div>
              <div className="label">
                {cars}
              </div>
            </div>
          </div>
          <div className="column">
            <div className="ui statistic">
              <div className="value">
                {user.routes}
              </div>
              <div className="label">
                {routes}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfileInfo;
