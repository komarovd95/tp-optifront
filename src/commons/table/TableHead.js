import React from 'react';
import TableHeader from './TableHeader';


export default class TableHead extends React.PureComponent {
  render() {
    const { columns, onSortChange, sortColumn, sortDirection } = this.props;

    return (
      <thead>
        <tr>
          {columns.map(column =>
            <TableHeader key={column.key}
                         column={column}
                         onClick={onSortChange}
                         sortColumn={sortColumn}
                         sortDirection={sortDirection}/>)
          }
        </tr>
      </thead>
    );
  }
}

TableHead.propTypes = {
  columns: React.PropTypes.arrayOf(React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    sortable: React.PropTypes.bool,
    clickable: React.PropTypes.bool
  })).isRequired,
  onSortChange: React.PropTypes.func,
  sortColumn: React.PropTypes.string,
  sortDirection: React.PropTypes.string
};
