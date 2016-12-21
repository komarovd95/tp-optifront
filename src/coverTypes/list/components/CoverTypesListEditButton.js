import React, { PureComponent, PropTypes } from 'react';
import { CoverType } from '../../model';
import { Link } from 'react-router';


class CoverTypesListEditButton extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(CoverType).isRequired
  };

  render() {
    const { item: coverType } = this.props;

    return (
      <Link to={`/admin/coverTypes/id${coverType.id}`} className="ui positive basic tiny button">
        <i className="edit icon"/> Редактировать
      </Link>
    );
  }
}

export default CoverTypesListEditButton;
