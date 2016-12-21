import {createSelector} from 'reselect';


const getCarsEntities = state => state.cars.list.data.entities;
const getCarsResult   = state => state.cars.list.data.result;

export const getCarsArray = createSelector(getCarsEntities, getCarsResult,
  (entities, result) => result ? result.map(id => entities[id]) : []);


const getFilterSelector = state => state.cars.list.filter;

export const getFilter = createSelector(getFilterSelector, filter => {
  const result = { ...filter };

  const [velocityFrom, velocityTo] = filter.maxVelocity.split('-');
  const [consumptionFrom, consumptionTo] = filter.fuelConsumption.split('-');

  delete result.maxVelocity;
  result.maxVelocityFrom = Number.parseInt(velocityFrom);
  result.maxVelocityTo   = Number.parseInt(velocityTo);

  delete result.fuelConsumption;
  result.fuelConsumptionFrom = Number.parseFloat(consumptionFrom);
  result.fuelConsumptionTo   = Number.parseFloat(consumptionTo);

  return result;
});
