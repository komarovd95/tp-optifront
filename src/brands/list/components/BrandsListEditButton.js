import React, { PureComponent, PropTypes } from 'react';
import { CarBrand} from '../../model';
import { Link } from 'react-router';


class BrandsListEditButton extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(CarBrand).isRequired
  };

  render() {
    const { item: brand } = this.props;

    return (
      <Link to={`/admin/brands/id${brand.id}`} className="ui positive basic tiny button">
        <i className="edit icon"/> Редактировать
      </Link>
    );
  }
}

export default BrandsListEditButton;
