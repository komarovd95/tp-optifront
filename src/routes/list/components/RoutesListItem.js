import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { PathRoute } from '../../model';


class RoutesListItem extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(PathRoute).isRequired
  };


  render() {
    const { item: route } = this.props;

    return (
      <div className="violet card">
        <div className="content">
          <div className="header">{route.name}</div>
          <div className="meta">Дата изменения: {route.updatedAt}</div>
        </div>
        <Link to={`/routes/id${route.id}`} className="ui bottom attached button">
          Подробнее
        </Link>
      </div>
    );
  }
}

export default RoutesListItem;
