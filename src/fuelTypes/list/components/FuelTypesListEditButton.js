import React, { PureComponent, PropTypes } from 'react';
import { FuelType } from '../../model';
import { Link } from 'react-router';


class FuelTypesListEditButton extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(FuelType).isRequired
  };

  render() {
    const { item: fuelType } = this.props;

    return (
      <Link to={`/admin/fuelTypes/id${fuelType.id}`} className="ui positive basic tiny button">
        <i className="edit icon"/> Редактировать
      </Link>
    );
  }
}

export default FuelTypesListEditButton;
