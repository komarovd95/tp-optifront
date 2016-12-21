import React, { Component, PropTypes } from 'react';
import Grid from '../../../grid';
import { PathUser } from '../../model';
import UsersListToolbar from './UsersListToolbar';
import UsersListEditButton from './UsersListEditButton';
import { Pageable } from "../../../utils/CallAPI";


class UsersList extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.instanceOf(PathUser)).isRequired,
    filter: PropTypes.shape({
      username: PropTypes.string
    }),
    pageable: PropTypes.instanceOf(Pageable).isRequired,
    isFetching: PropTypes.bool,
    requestData: PropTypes.func.isRequired
  };

  static columns = [
    {
      key: 'username',
      name: 'Имя пользователя'
    },
    {
      key: 'driveStyle',
      name: 'Стиль вождения'
    },
    {
      key: 'roles',
      name: 'Роль пользователя'
    },
    {
      key: 'updatedAt',
      name: 'Последнее обновление'
    },
    {
      key: 'edit',
      name: 'Редактировать',
      renderer: UsersListEditButton
    }
  ];

  componentDidMount() {
    this.props.requestData();
  }

  onFilterChange = username => this.props.requestData(undefined, undefined, { username });
  onSortChange = sort => this.props.requestData(undefined, sort, undefined);
  onPageChange = page => this.props.requestData({ page });

  render() {
    const { users, pageable, isFetching, filter, requestData } = this.props;

    const toolbar = (<UsersListToolbar filter={filter.username}
                                       onFilterChange={this.onFilterChange}
                                       onSortChange={this.onSortChange}
                                       refresh={() => requestData()}/>);

    return (
      <Grid columns={UsersList.columns}
            toolbar={toolbar}
            loading={isFetching}
            items={users}
            pageable={pageable}
            onPageChange={this.onPageChange}/>
    );
  }
}

export default UsersList;
