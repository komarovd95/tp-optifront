import React, { Component, PropTypes } from 'react';
import Grid from '../../../grid';
import { Street } from '../../model';
import { Pageable } from '../../../utils/CallAPI';
import StreetsListToolbar from './StreetsListToolbar';
import StreetsListEditButton from './StreetsListEditButton';


class StreetsList extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    streets: PropTypes.arrayOf(Street),
    pageable: PropTypes.instanceOf(Pageable),
    filter: PropTypes.shape({
      streetName: PropTypes.string,
      streetType: PropTypes.array
    }),
    streetTypes: PropTypes.array,
    requestData: PropTypes.func.isRequired
  };

  static columns = [
    {
      key: 'streetType',
      name: 'Тип'
    },
    {
      key: 'streetName',
      name: 'Название'
    },
    {
      key: 'edit',
      name: 'Редактировать',
      renderer: StreetsListEditButton
    }
  ];

  componentDidMount() {
    this.props.requestData();
  }

  onFilterChange = ({ streetName, streetType }) =>
    this.props.requestData(undefined, undefined, { streetName, streetType });
  onSortChange = sort => this.props.requestData(undefined, sort, undefined);
  onPageChange = page => this.props.requestData({ page });

  render() {
    const { isFetching, streets, pageable, filter, requestData, streetTypes } = this.props;

    const toolbar = (<StreetsListToolbar filter={filter}
                                         onFilterChange={this.onFilterChange}
                                         onSortChange={this.onSortChange}
                                         streetTypes={streetTypes}
                                         refresh={() => requestData()}/>);

    return (
      <Grid columns={StreetsList.columns}
            toolbar={toolbar}
            loading={isFetching}
            items={streets}
            pageable={pageable}
            onPageChange={this.onPageChange}/>
    );
  }
}

export default StreetsList;
