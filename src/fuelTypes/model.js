import Entity from '../utils/Entity';
import { Schema, normalize, arrayOf } from 'normalizr';
import mapValues from 'lodash/mapValues';


export class FuelType extends Entity {
  constructor({ id, createdAt, updatedAt, fuelTypeName, cost, _links }) {
    super(id, createdAt, updatedAt, _links);

    this._fuelTypeName = fuelTypeName;
    this._cost = cost;
  }

  get fuelTypeName() {
    return this._fuelTypeName;
  }

  get cost() {
    return this._cost;
  }
}


export const fuelTypesSchema = new Schema('fuelTypes');

export const getFuelTypesFromResponseData = data => {
  const fuelTypes = data['_embedded'] ? data['_embedded'] : {};

  const normalized = normalize(fuelTypes, {
    fuelTypes: arrayOf(fuelTypesSchema)
  });

  const entities = mapValues(normalized.entities.fuelTypes, f => new FuelType(f));
  const result = normalized.result.fuelTypes;

  return {
    entities,
    result
  };
};
