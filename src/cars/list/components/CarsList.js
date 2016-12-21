import React, { Component, PropTypes } from 'react';
import Grid from '../../../grid';
import CarsListToolbar from './CarsListToolbar';
import CarsListAddButton from './CarsListAddButton';
import CarsListEditButton from './CarsListEditButton';
import { Pageable } from '../../../utils/CallAPI';
import { Car } from '../../model';


class CarsList extends Component {
  static propTypes = {
    cars: PropTypes.arrayOf(PropTypes.instanceOf(Car)).isRequired,
    isFetching: PropTypes.bool,
    pageable: PropTypes.instanceOf(Pageable).isRequired,
    filter: PropTypes.object.isRequired,
    filterValues: PropTypes.object,
    requestCache: PropTypes.func.isRequired,
    requestData: PropTypes.func.isRequired,
    brands: PropTypes.array,
    fuelTypes: PropTypes.array,
    params: PropTypes.shape({
      userId: PropTypes.string
    }).isRequired
  };


  componentWillMount() {
    this.adminView = !this.props.params.userId;

    if (this.adminView) {
      this.columns[5] = {
        key: 'edit',
        name: 'Редактировать',
        renderer: CarsListEditButton
      };
    }
  }

  componentDidMount() {
    this.props.requestCache()
      .then(() => this.props.requestData(this.adminView));
  }

  columns = [
    {
      key: 'brandName',
      name: 'Марка'
    },
    {
      key: 'name',
      name: 'Модель'
    },
    {
      key: 'fuelTypeName',
      name: 'Тип топлива'
    },
    {
      key: 'fuelConsumption',
      name: 'Расход'
    },
    {
      key: 'maxVelocity',
      name: 'Макс. скорость'
    },
    {
      key: 'select',
      name: 'Добавить',
      renderer: CarsListAddButton
    }
  ];

  onFilterChange = filter => {
    const result = {};

    result.name = filter.name;
    result.brand = filter.brand;
    result.fuelType = filter.fuelType;
    result.onlyMine = filter.onlyMine;
    result.maxVelocity = filter.maxVelocityFrom + "-" + filter.maxVelocityTo;
    result.fuelConsumption = (filter.fuelConsumptionFrom + "-" + filter.fuelConsumptionTo)
      .replace(',', '.');

    return this.props.requestData(this.adminView, undefined, undefined, result);
  };

  onSortChange   = sort   => this.props.requestData(this.adminView, undefined, sort, undefined);
  onPageChange   = page   => this.props.requestData(this.adminView, { page });


  render() {
    const {
      cars, isFetching, pageable, filter, filterValues, brands, fuelTypes, requestData
    } = this.props;

    const toolbar = (<CarsListToolbar filter={filter}
                                      filterValues={filterValues}
                                      brands={brands}
                                      fuelTypes={fuelTypes}
                                      onFilterChange={this.onFilterChange}
                                      onSortChange={this.onSortChange}
                                      refresh={() => requestData()}
                                      admin={this.adminView}/>);

    return (
      <Grid columns={this.columns}
            toolbar={toolbar}
            loading={isFetching}
            items={cars}
            pageable={pageable}
            onPageChange={this.onPageChange}/>
    );
  }
}

export default CarsList;

// export default class CarList extends React.Component {
//   static columns = [
//     {
//       key: 'brandName',
//       name: 'Марка'
//     },
//     {
//       key: 'name',
//       name: 'Модель'
//     },
//     {
//       key: 'fuelTypeName',
//       name: 'Тип топлива'
//     },
//     {
//       key: 'fuelConsumption',
//       name: 'Расход'
//     },
//     {
//       key: 'maxVelocity',
//       name: 'Скорость'
//     },
//     {
//       key: 'Редактировать',
//       renderer: (car) => {
//         const route = `/cars/id${car.id}`;
//
//         return (
//           <Link key={route} to={route} className="ui positive basic tiny button">
//             <i className="edit icon"/> Редактировать
//           </Link>
//         );
//       }
//     }
//   ];
//
//   componentDidMount() {
//     this.props.requestData();
//   }
//
//
//   render() {
//     const { cars, isFetching } = this.props;
//
//     const footer = (
//       <tfoot>
//         <tr>
//           <th colSpan={CarList.columns.length} style={{ textAlign: 'right' }}>
//             <Pagination pageable={new Pageable(0, 5, 10, 50)} onPageClick={page => console.log(page)}/>
//           </th>
//         </tr>
//       </tfoot>
//     );
//
//     return (
//       <div className="ui segment">
//         <Spinner active={isFetching}/>
//         <CarsListToolbar/>
//         <TableGrid columns={CarList.columns} footer={footer} items={cars}/>
//       </div>
//     );
//   }
// }
//
// CarList.propTypes = {
//   cars: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Car)).isRequired,
//   isFetching: React.PropTypes.bool.isRequired,
//   requestData: React.PropTypes.func.isRequired
// };
