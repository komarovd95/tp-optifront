import React from 'react';
import TableHead from './TableHead';


export default class TableGrid extends React.Component {
  constructor() {
    super();
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  handleSortChange(sortColumn) {
    if (this.props.onSortChange) {
      this.props.onSortChange(sortColumn);
    }
  }

  render() {
    const { columns, sortColumn, sortDirection, footer, items } = this.props;

    return (
      <table className="ui selectable celled table">
        <TableHead columns={columns}
                   onSortChange={this.handleSortChange}
                   sortColumn={sortColumn}
                   sortDirection={sortDirection}/>
        <tbody>
          {items.map(item => itemRenderer(columns, item))}
        </tbody>
        {footer}
      </table>
    );
  }
}

const itemRenderer = (columns, item) => {
  return (
    <tr key={item.id}>
      {columns.map(({ key, renderer }) =>
        <td key={`${key}-${item.id}`}>{renderer ? renderer(item) : item[key]}</td>)}
    </tr>
  );
};


TableGrid.propTypes = {
  columns: React.PropTypes.arrayOf(React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    sortable: React.PropTypes.bool,
    clickable: React.PropTypes.bool
  })).isRequired,
  sortColumn: React.PropTypes.string,
  sortDirection: React.PropTypes.string,
  onSortChange: React.PropTypes.func,
  footer: React.PropTypes.element,
  items: React.PropTypes.array.isRequired
};

TableGrid.defaultProps = {
  items: []
};
