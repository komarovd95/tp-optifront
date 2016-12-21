import Entity from '../utils/Entity';
import { Schema, normalize, arrayOf } from 'normalizr';
import mapValues from 'lodash/mapValues';


export class CoverType extends Entity {
  constructor({ id, createdAt, updatedAt, coverTypeName, slowdown, _links }) {
    super(id, createdAt, updatedAt, _links);

    this._coverTypeName = coverTypeName;
    this._streetType = slowdown;
  }

  get coverTypeName() {
    return this._coverTypeName;
  }

  get slowdown() {
    return this._streetType;
  }
}


export const coverTypesSchema = new Schema('coverTypes');

export const getCoverTypesFromResponseData = data => {
  const coverTypes = data['_embedded'] ? data['_embedded'] : {};

  const normalized = normalize(coverTypes, {
    coverTypes: arrayOf(coverTypesSchema)
  });

  const entities = mapValues(normalized.entities.coverTypes, f => new CoverType(f));
  const result = normalized.result.coverTypes;

  return {
    entities,
    result
  };
};
