import React, { PureComponent, PropTypes } from 'react';
import { Street } from '../../model';
import { Link } from 'react-router';


class StreetsListEditButton extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(Street).isRequired
  };

  render() {
    const { item: street } = this.props;

    return (
      <Link to={`/admin/streets/id${street.id}`} className="ui positive basic tiny button">
        <i className="edit icon"/> Редактировать
      </Link>
    );
  }
}

export default StreetsListEditButton;
