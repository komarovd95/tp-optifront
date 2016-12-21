import React, { Component, PropTypes } from 'react';
import Dropdown from '../../../commons/Dropdown';


class UsersListToolbar extends Component {
  static propTypes = {
    filter: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
  };

  dropdownItems = [
    {
      value: 'username,ASC',
      display: <span><i className="sort content ascending icon"/> Имя</span>
    },
    {
      value: 'username,DESC',
      display: <span><i className="sort content descending icon"/> Имя</span>
    },
    {
      value: 'updatedAt,ASC',
      display: <span><i className="sort content ascending icon"/> Дата изменения</span>
    },
    {
      value: 'updatedAt,DESC',
      display: <span><i className="sort content descending icon"/> Дата изменения</span>
    }
  ];


  handleFilterChange = event => {
    let value = event.target.value;

    if (value || value === '') {
      value = value.trim();

      if (/^[a-zA-Z0-9]*$/.test(value)) {
        this.props.onFilterChange(value);
      }
    }
  };

  handleSortChange = sort => this.props.onSortChange(sort);


  render() {
    return (
      <div className="ui stackable grid">
        <div className="four column row">
          <div className="column">
            <div className="ui labeled fluid input">
              <div className="ui label">
                <i className="search icon" style={{ margin: 0 }}/>
              </div>
              <input type="text"
                     placeholder="Имя пользователя"
                     onChange={this.handleFilterChange}
                     defaultValue={this.props.filter}/>
            </div>
          </div>
          <div className="column">
            <div className="ui fluid buttons">
              <button className="ui right labeled icon button"
                      onClick={this.props.refresh}>
                Обновить <i className="refresh icon"/>
              </button>
            </div>
          </div>
          <div className="right floated column">
            <Dropdown icon="filter"
                      defaultText="Сортировать по"
                      items={this.dropdownItems}
                      onChange={this.handleSortChange}/>
          </div>
        </div>
      </div>
    );
  }
}

export default UsersListToolbar;
