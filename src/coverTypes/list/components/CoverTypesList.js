import React, { Component, PropTypes } from 'react';
import Grid from '../../../grid';
import { CoverType } from '../../model';
import { Pageable } from '../../../utils/CallAPI';
import CoverTypesListToolbar from './CoverTypesListToolbar';
import CoverTypesListEditButton from './CoverTypesListEditButton';


class CoverTypesList extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    coverTypes: PropTypes.arrayOf(CoverType),
    pageable: PropTypes.instanceOf(Pageable),
    filter: PropTypes.string,
    requestData: PropTypes.func.isRequired
  };

  static columns = [
    {
      key: 'coverTypeName',
      name: 'Тип покрытия'
    },
    {
      key: 'slowdown',
      name: 'Коэфф. замедления'
    },
    {
      key: 'edit',
      name: 'Редактировать',
      renderer: CoverTypesListEditButton
    }
  ];

  componentDidMount() {
    this.props.requestData();
  }

  onFilterChange = coverTypeName => this.props.requestData(undefined, undefined, { coverTypeName });
  onSortChange = sort => this.props.requestData(undefined, sort, undefined);
  onPageChange = page => this.props.requestData({ page });

  render() {
    const { isFetching, coverTypes, pageable, filter, requestData } = this.props;

    const toolbar = (<CoverTypesListToolbar filter={filter}
                                           onFilterChange={this.onFilterChange}
                                           onSortChange={this.onSortChange}
                                           refresh={() => requestData()}/>);

    return (
      <Grid columns={CoverTypesList.columns}
            toolbar={toolbar}
            loading={isFetching}
            items={coverTypes}
            pageable={pageable}
            onPageChange={this.onPageChange}/>
    );
  }
}

export default CoverTypesList;
