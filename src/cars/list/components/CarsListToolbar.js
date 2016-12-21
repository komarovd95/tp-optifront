import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Accordion from '../../../commons/Accordion';
import Dropdown from '../../../commons/Dropdown';
import CarsListFilter from './CarsListFilter';


class CarsListToolbar extends Component {
  static propTypes = {
    filter: PropTypes.shape({
      name: PropTypes.string,
      brand: PropTypes.array,
      fuelType: PropTypes.array,
      fuelConsumptionFrom: PropTypes.number,
      fuelConsumptionTo: PropTypes.number,
      maxVelocityFrom: PropTypes.number,
      maxVelocityTo: PropTypes.number
    }).isRequired,
    filterValues: PropTypes.object,
    onSortChange: PropTypes.func,
    brands: PropTypes.array,
    fuelTypes: PropTypes.array,
    onFilterChange: PropTypes.func,
    refresh: PropTypes.func,
    admin: PropTypes.bool
  };

  dropdownItems = [
    {
      value: 'name,ASC',
      display: <span><i className="sort content ascending icon"/> Модель</span>
    },
    {
      value: 'name,DESC',
      display: <span><i className="sort content descending icon"/> Модель</span>
    },
    {
      value: 'brand,ASC',
      display: <span><i className="sort content ascending icon"/> Марка</span>
    },
    {
      value: 'brand,DESC',
      display: <span><i className="sort content descending icon"/> Марка</span>
    },
    {
      value: 'fuelType,ASC',
      display: <span><i className="sort content ascending icon"/> Тип топлива</span>
    },
    {
      value: 'fuelType,DESC',
      display: <span><i className="sort content descending icon"/> Тип топлива</span>
    },
    {
      value: 'maxVelocity,ASC',
      display: <span><i className="sort content ascending icon"/> Макс. скорость</span>
    },
    {
      value: 'maxVelocity,DESC',
      display: <span><i className="sort content descending icon"/> Макс. скорость</span>
    },
    {
      value: 'fuelConsumption,ASC',
      display: <span><i className="sort content ascending icon"/> Расход</span>
    },
    {
      value: 'fuelConsumption,DESC',
      display: <span><i className="sort content descending icon"/> Расход</span>
    }
  ];


  render() {
    const {
      filter, filterValues, onSortChange, brands, fuelTypes, onFilterChange, refresh, admin
    } = this.props;

    return (
      <div className="ui stackable grid">
        <div className="row">
          <div className="column">
            <Accordion>
              <div className="title">
                <i className="filter icon"/> Фильтр
              </div>
              <div className="content">
                <CarsListFilter initialValues={filter}
                                filterValues={filterValues}
                                brands={brands}
                                fuelTypes={fuelTypes}
                                onFilterChange={onFilterChange}
                                admin={admin}/>
              </div>
            </Accordion>
          </div>
        </div>
        <div className="row">
          <div className="column">
            <div className="ui grid">
              <div className="four column row">
                <div className="left floated column">
                  <div className="ui fluid buttons">
                    {admin && (
                      <Link to="/admin/cars/new" className="ui labeled icon button">
                        <i className="plus icon"/> Создать
                      </Link>
                    )}
                    <button className="ui right labeled icon button" onClick={refresh}>
                      Обновить <i className="refresh icon"/>
                    </button>
                    {/*<button className="ui right labeled icon positive button" disabled={true}>*/}
                      {/*Сохранить <i className="save icon"/>*/}
                    {/*</button>*/}
                  </div>
                </div>
                <div className="right floated column">
                  <Dropdown icon="filter"
                            defaultText="Сортировать по"
                            items={this.dropdownItems}
                            onChange={onSortChange}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default CarsListToolbar;

// export default class CarsListToolbar extends React.PureComponent {
//   render() {
//     return (
//       <div className="ui stackable grid">
//         <div className="row">
//           <div className="column">
//             <Accordion>
//               <div className="title">
//                 <i className="filter icon"/> Фильтр
//               </div>
//               <div className="content">
//                 <CarsListFilter/>
//               </div>
//             </Accordion>
//           </div>
//         </div>
//         <div className="row">
//           <div className="column">
//             <div className="ui grid">
//               <div className="four column row">
//                 <div className="left floated column">
//                   <div className="ui fluid buttons">
//                     <button className="ui labeled icon button">
//                       <i className="plus icon"/> Создать
//                     </button>
//                     <button className="ui right labeled icon button">
//                       Обновить <i className="refresh icon"/>
//                     </button>
//                   </div>
//                 </div>
//                 <div className="right floated column">
//                   <Dropdown icon="filter"
//                             defaultText="Сортировать по"
//                             items={[]}
//                             onChange={val => console.log(val)}/>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
