import {formatDate} from './DateUtil';

export default class Entity {
  constructor(id, createdAt, updatedAt, links) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    if (links && links.self) {
      this._links = links;
      this._self = links.self.href;
    }
  }

  get self() {
    return this._self;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return formatDate(this._createdAt);
  }

  get updatedAt() {
    return formatDate(this._updatedAt);
  }

  serialize() {
    return Object.keys(this).reduce((obj, key) => {
      obj[key.substring(1)] = this[key];
      return obj;
    }, {});
  }

  toPlainObject() {
    return Object.keys(this).reduce((obj, key) => {
      const subKey = key.substring(1);
      obj[subKey] = this[subKey];
      return obj;
    }, {});
  }
}
