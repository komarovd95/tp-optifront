import Entity from '../utils/Entity';
import { Schema, normalize, arrayOf } from 'normalizr';
import mapValues from 'lodash/mapValues';


export class CarBrand extends Entity {
  constructor({ id, createdAt, updatedAt, brandName, _links }) {
    super(id, createdAt, updatedAt, _links);

    this._brandName = brandName;
  }

  get brandName() {
    return this._brandName;
  }
}


export const brandsSchema = new Schema('carBrands');

export const getBrandsFromResponseData = data => {
  const brands = data['_embedded'] ? data['_embedded'] : {};

  const normalized = normalize(brands, {
    carBrands: arrayOf(brandsSchema)
  });

  const entities = mapValues(normalized.entities.carBrands, b => new CarBrand(b));
  const result = normalized.result.carBrands;

  return {
    entities,
    result
  };
};
