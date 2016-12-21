import React, { Component, PropTypes } from 'react';
import Grid from '../../../grid';
import { CarBrand } from '../../model';
import { Pageable } from '../../../utils/CallAPI';
import BrandsListToolbar from './BrandsListToolbar';
import BrandsListEditButton from './BrandsListEditButton';


class BrandsList extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    brands: PropTypes.arrayOf(CarBrand),
    pageable: PropTypes.instanceOf(Pageable),
    filter: PropTypes.string,
    requestData: PropTypes.func.isRequired
  };

  static columns = [
    {
      key: 'brandName',
      name: 'Название марки'
    },
    {
      key: 'edit',
      name: 'Редактировать',
      renderer: BrandsListEditButton
    }
  ];

  componentDidMount() {
    this.props.requestData();
  }

  onFilterChange = brandName => this.props.requestData(undefined, undefined, { brandName });
  onSortChange = sort => this.props.requestData(undefined, sort, undefined);
  onPageChange = page => this.props.requestData({ page });

  render() {
    const { isFetching, brands, pageable, filter, requestData } = this.props;

    const toolbar = (<BrandsListToolbar filter={filter}
                                        onFilterChange={this.onFilterChange}
                                        onSortChange={this.onSortChange}
                                        refresh={() => requestData()}/>);

    return (
      <Grid columns={BrandsList.columns}
            toolbar={toolbar}
            loading={isFetching}
            items={brands}
            pageable={pageable}
            onPageChange={this.onPageChange}/>
    );
  }
}

export default BrandsList;
