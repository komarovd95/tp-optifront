import React from 'react';
import ReactPaginate from 'react-paginate';
import { Pageable } from '../utils/CallAPI';


export default class Pagination extends React.Component {
  constructor() {
    super();
    this.handlePageSelect = this.handlePageSelect.bind(this);
  }

  handlePageSelect({ selected }) {
    this.props.onPageClick(selected);
  }

  render() {
    const { pageable } = this.props;

    return (
      <ReactPaginate previousLabel="назад"
                     nextLabel="вперед"
                     breakLabel={<span>...</span>}
                     breakClassName="disabled item"
                     pageNum={pageable.totalPages}
                     forceSelected={pageable.page}
                     marginPagesDisplayed={2}
                     pageRangeDisplayed={5}
                     clickCallback={this.handlePageSelect}
                     containerClassName="ui pagination menu"
                     pageClassName="item"
                     previousClassName="item"
                     nextClassName="item"
                     activeClassName="active"/>
    );
  }
}

Pagination.propTypes = {
  pageable: React.PropTypes.instanceOf(Pageable).isRequired,
  onPageClick: React.PropTypes.func.isRequired
};
