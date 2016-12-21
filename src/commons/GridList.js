import React from 'react';
import ReactDataGrid from 'react-data-grid';
import ReactPaginate from 'react-paginate';


class GridEmptyView extends React.Component {
  render() {
    return (
      <p>Нет данных</p>
    );
  }
}


export default class GridList extends React.Component {
  constructor() {
    super();
    this.rowGetter = this.rowGetter.bind(this);
  }

  componentDidMount() {
    $('.react-grid-Canvas > div').addClass('ui five column grid');
    this.props.requestData({});
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('next', this.props.data, nextProps.data);
  //
  //   if (!this.props.length && nextProps.data.length) {
  //     $('.react-grid-Canvas > div').addClass('ui five column grid');
  //   }
  // }

  componentDidUpdate(prevProps) {
    if (this.props.data.length && !prevProps.data.length) {
      $('.react-grid-Canvas > div').addClass('ui five column grid');
    }
  }

  rowGetter(index) {
    return this.props.data[index];
  }

  render() {
    const {columns, data, rowRenderer, className, toolbar, isFetching, pageable} = this.props;

    return (
      <div className={className}>
        {isFetching &&
          <div className="ui active inverted dimmer">
            <div className="ui text loader">
              Загрузка данных...
            </div>
          </div>
        }
        <ReactDataGrid columns={columns}
                       rowGetter={this.rowGetter}
                       rowsCount={data ? data.length : 0}
                       rowRenderer={rowRenderer}
                       toolbar={toolbar}
                       minHeight={300}
                       emptyRowsView={GridEmptyView}/>

        <div className="ui right aligned row">
          <div className="column">
            <ReactPaginate previousLabel="назад"
                           nextLabel="вперед"
                           breakLabel={<span>...</span>}
                           breakClassName="disabled item"
                           pageNum={pageable.totalPages}
                           forceSelected={pageable.page}
                           marginPagesDisplayed={2}
                           pageRangeDisplayed={5}
                           clickCallback={() => console.log('hello')}
                           containerClassName="ui pagination menu"
                           pageClassName="item"
                           previousClassName="item"
                           nextClassName="item"
                           activeClassName="active" />
          </div>
        </div>
      </div>
    );
  }
}

GridList.propTypes = {
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array,
  rowRenderer: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.func]),
  className: React.PropTypes.string,
  toolbar: React.PropTypes.element,
  requestData: React.PropTypes.func.isRequired,
  isFetching: React.PropTypes.bool.isRequired
};
