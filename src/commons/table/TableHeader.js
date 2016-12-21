import React from 'react';


export default class TableHeader extends React.PureComponent {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.column.sortable && !nextProps.column.clickable) {
      return false;
    } else if (this.props.column.key !== this.props.sortColumn
      && this.props.column.key !== nextProps.sortColumn) {
      return false;
    } else {
      return super.shouldComponentUpdate(nextProps);
    }
  }

  handleClick() {
    const { column: { key, sortable, clickable }, onClick } = this.props;

    if ((sortable || clickable) && onClick) {
      onClick(key);
    }
  }

  render() {
    const { column: { key, name, sortable, clickable }, sortColumn, sortDirection } = this.props;

    let sortIcon = null;
    if (sortable) {
      if (sortColumn === key) {
        if (sortDirection === 'ASC') {
          sortIcon = <i className="sort content ascending icon"/>;
        } else if (sortDirection === 'DESC') {
          sortIcon = <i className="sort content descending icon"/>;
        }
      }
    }

    const style = (sortable || clickable) && { cursor: 'pointer' };

    return (
      <th onClick={this.handleClick} style={style}>
        {name || key} {sortIcon}
      </th>
    );
  }
}

TableHeader.propTypes = {
  column: React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    sortable: React.PropTypes.bool,
    clickable: React.PropTypes.bool
  }).isRequired,
  sortColumn: React.PropTypes.string,
  sortDirection: React.PropTypes.string,
  onClick: React.PropTypes.func
};
