import React, { PureComponent, PropTypes } from 'react';
import Pagination from '../commons/Pagination';
import { Pageable } from '../utils/CallAPI';


class TableFooter extends PureComponent {
  static propTypes = {
    colSpan: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    pageable: PropTypes.instanceOf(Pageable).isRequired
  };

  render() {
    const { colSpan, pageable, onPageChange } = this.props;

    return (
      <tfoot>
        <tr>
          <th colSpan={colSpan} style={{ textAlign: 'right' }}>
            <Pagination pageable={pageable} onPageClick={onPageChange}/>
          </th>
        </tr>
      </tfoot>
    );
  }
}

export default TableFooter;
