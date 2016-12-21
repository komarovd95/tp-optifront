import React, { Component, PropTypes } from 'react';
import Grid from '../../../grid';
import { FuelType } from '../../model';
import { Pageable } from '../../../utils/CallAPI';
import FuelTypesListToolbar from './FuelTypesListToolbar';
import FuelTypesListEditButton from './FuelTypesListEditButton';


class FuelTypesList extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    fuelTypes: PropTypes.arrayOf(FuelType),
    pageable: PropTypes.instanceOf(Pageable),
    filter: PropTypes.string,
    requestData: PropTypes.func.isRequired
  };

  static columns = [
    {
      key: 'fuelTypeName',
      name: 'Тип топлива'
    },
    {
      key: 'cost',
      name: 'Цена'
    },
    {
      key: 'edit',
      name: 'Редактировать',
      renderer: FuelTypesListEditButton
    }
  ];

  componentDidMount() {
    this.props.requestData();
  }

  onFilterChange = fuelTypeName => this.props.requestData(undefined, undefined, { fuelTypeName });
  onSortChange = sort => this.props.requestData(undefined, sort, undefined);
  onPageChange = page => this.props.requestData({ page });

  render() {
    const { isFetching, fuelTypes, pageable, filter, requestData } = this.props;

    const toolbar = (<FuelTypesListToolbar filter={filter}
                                           onFilterChange={this.onFilterChange}
                                           onSortChange={this.onSortChange}
                                           refresh={() => requestData()}/>);

    return (
      <Grid columns={FuelTypesList.columns}
            toolbar={toolbar}
            loading={isFetching}
            items={fuelTypes}
            pageable={pageable}
            onPageChange={this.onPageChange}/>
    );
  }
}

export default FuelTypesList;
