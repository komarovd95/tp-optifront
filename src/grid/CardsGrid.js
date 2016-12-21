import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';
import Pagination from '../commons/Pagination';
import { Spinner } from '../spinner';
import { Pageable } from '../utils/CallAPI';


class CardsGrid extends Component {
  static propTypes = {
    rowLength: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })),
    component: PropTypes.func.isRequired,
    pageable: PropTypes.instanceOf(Pageable),
    onPageChange: PropTypes.func,
    toolbar: PropTypes.node,
    loading: PropTypes.bool
  };

  static defaultProps = {
    rowLength: 'five',
    items: []
  };

  handlePageChange = page => {
    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }
  };


  render() {
    const { rowLength, items, component, pageable, toolbar, loading } = this.props;

    const style = {
      width: '100%',
      textAlign: 'center',
      padding: '1rem'
    };

    return (
      <div className="ui basic segment" style={{ padding: 0 }}>
        <Spinner active={loading}/>
        {toolbar}
        <div className="ui top attached segment">
          <div className={`ui ${rowLength} cards`}>
            {items.length === 0 && <div style={style}>Нет данных</div>}
            {items.map(item => React.createElement(component, {
              item,
              key: shortid.generate()
            }))}
          </div>
        </div>
        <div className="ui right aligned bottom attached segment"
             style={{ background: 'rgb(249, 250, 251'}}>
          <Pagination pageable={pageable} onPageClick={this.handlePageChange}/>
        </div>
      </div>
    );
  }
}

export default CardsGrid;
