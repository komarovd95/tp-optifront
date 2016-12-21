import Entity from '../utils/Entity';
import { Schema, arrayOf, normalize } from 'normalizr';
import mapValues from 'lodash/mapValues';


export class Car extends Entity {
  constructor({id, name, createdAt, updatedAt, brandName, fuelTypeName, maxVelocity, owned,
    fuelConsumption, _links}) {
    super(id, createdAt, updatedAt, _links);

    this._name = name;
    this._brandName = brandName;
    this._fuelTypeName = fuelTypeName;
    this._maxVelocity = maxVelocity;
    this._fuelConsumption = fuelConsumption;
    this._owned = owned;
  }

  get name() {
    return this._name;
  }

  get brandName() {
    return this._brandName;
  }

  get fuelTypeName() {
    return this._fuelTypeName;
  }

  get maxVelocity() {
    return this._maxVelocity;
  }

  get fuelConsumption() {
    return this._fuelConsumption;
  }

  get owned() {
    return this._owned;
  }

  set owned(owned) {
    this._owned = owned;
  }

  // isOwnedBy(owner = {}) {
  //   return owner.id === (this._owner && this._owner.id);
  // }
}


export const carsSchema = new Schema('cars');

export const getCarsFromResponseData = (data) => {
  const cars = data['_embedded'] ? data['_embedded'] : {};

  const normalized = normalize(cars, {
    cars: arrayOf(carsSchema)
  });

  const entities = mapValues(normalized.entities.cars, r => new Car(r));
  const result = normalized.result.cars;

  return {
    entities,
    result
  };
};
