import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import { Car } from '../../model';


class CarsListEditButton extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(Car)
  };


  render() {
    const { item: car } = this.props;

    return (
      <Link to={`/admin/cars/id${car.id}`} className="ui positive basic tiny button">
        <i className="edit icon"/> Редактировать
      </Link>
    );
  }
}

export default CarsListEditButton;
