import Entity from '../utils/Entity';
import { Schema, normalize, arrayOf } from 'normalizr';
import mapValues from 'lodash/mapValues';


export class Street extends Entity {
  constructor({ id, createdAt, updatedAt, streetName, streetType, _links }) {
    super(id, createdAt, updatedAt, _links);

    this._streetName = streetName;
    this._streetType = streetType;
  }

  get streetName() {
    return this._streetName;
  }

  get streetType() {
    return this._streetType;
  }
}


export const streetsSchema = new Schema('streets');

export const getStreetsFromResponseData = data => {
  const streets = data['_embedded'] ? data['_embedded'] : {};

  const normalized = normalize(streets, {
    streets: arrayOf(streetsSchema)
  });

  const entities = mapValues(normalized.entities.streets, f => new Street(f));
  const result = normalized.result.streets;

  return {
    entities,
    result
  };
};
