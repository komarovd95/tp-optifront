import React, { PureComponent, PropTypes } from 'react';
import { PathUser } from '../../model';
import { browserHistory } from 'react-router';


class UsersListEditButton extends PureComponent {
  static propTypes = {
    item: PropTypes.instanceOf(PathUser).isRequired
  };

  onClick = () => {
    const { item: user } = this.props;

    browserHistory.push(`/id${user.id}/edit`);
  };

  render() {
    const { item: user } = this.props;

    if (user.isAdmin()) {
      return <p/>;
    } else {
      return (
        <button onClick={this.onClick} className="ui positive basic tiny button">
          <i className="edit icon"/> Редактировать
        </button>
      );
    }
  }
}

export default UsersListEditButton;
