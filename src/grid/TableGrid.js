import React, { PureComponent, PropTypes } from 'react';
import TableHead from './TableHead';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import { Spinner } from '../spinner';
import { Pageable } from '../utils/CallAPI';


class TableGrid extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    toolbar: PropTypes.node,
    columns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string,
      sortable: PropTypes.bool,
      clickable: PropTypes.bool
    })).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })).isRequired,
    pageable: PropTypes.instanceOf(Pageable).isRequired,
    onPageChange: PropTypes.func,
    loading: PropTypes.bool
  };

  static defaultProps = {
    items: []
  };

  handlePageChange = page => {
    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }
  };

  render() {
    const { className, style, toolbar, columns, items, pageable, loading } = this.props;

    return (
      <div className={className} style={style}>
        <Spinner active={loading}/>
        {toolbar}
        <table className="ui selectable celled table">
          <TableHead columns={columns}/>
          <TableBody columns={columns} items={items}/>
          <TableFooter pageable={pageable}
                       onPageChange={this.handlePageChange}
                       colSpan={columns.length}/>
        </table>
      </div>
    );
  }
}

export default TableGrid;
