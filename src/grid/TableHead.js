import React, { PureComponent, PropTypes } from 'react';
import TableHeader from './TableHeader';


class TableHead extends PureComponent {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired
    })).isRequired
  };

  render() {
    const { columns } = this.props;

    const headers = columns.map(col =>
      <TableHeader key={col.key} column={col}/>
    );

    return (
      <thead>
        <tr>
          {headers}
        </tr>
      </thead>
    );
  }
}

export default TableHead;
