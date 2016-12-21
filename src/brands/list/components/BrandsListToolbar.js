import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Dropdown from '../../../commons/Dropdown';


class BrandsListToolbar extends Component {
  static propTypes = {
    filter: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    onSortChange: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired
  };

  dropdownItems = [
    {
      value: 'brandName,ASC',
      display: <span><i className="sort content ascending icon"/> Название</span>
    },
    {
      value: 'brandName,DESC',
      display: <span><i className="sort content descending icon"/> Название</span>
    }
  ];


  handleFilterChange = event => {
    let value = event.target.value;

    if (value || value === '') {
      value = value.trim();

      if (/^[a-zA-Z0-9_а-яА-Я]*$/.test(value)) {
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
                     placeholder="Название марки"
                     onChange={this.handleFilterChange}
                     defaultValue={this.props.filter}/>
            </div>
          </div>
          <div className="column">
            <div className="ui fluid buttons">
              <Link to="/admin/brands/new" className="ui labeled icon button">
                <i className="plus icon"/> Создать
              </Link>
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

export default BrandsListToolbar;

