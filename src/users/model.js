import Entity from '../utils/Entity';
import { driveStyles, ADMIN, USER } from './constants';
import { Schema, arrayOf, normalize } from 'normalizr';
import mapValues from 'lodash/mapValues';


export const stringToDriveStyle = (driveStyle) => {
  for (let [key, value] of Object.entries(driveStyles)) {
    if (value === driveStyle) {
      return key;
    }
  }
};


export const rolesToString = (roles) => roles.includes('ROLE_ADMIN') ? ADMIN : USER;
export const stringToRoles = (role) => {
  const roles = ['ROLE_USER'];
  if (role === ADMIN) {
    roles.push('ROLE_ADMIN');
  }

  return roles;
};


export class PathUser extends Entity {
  constructor({id, username, createdAt, updatedAt, driveStyle, roles, cars, routes, _links}) {
    super(id, createdAt, updatedAt, _links);

    this._username = username;
    this._driveStyle = driveStyle;
    this._roles = roles;
    this._cars = cars;
    this._routes = routes;
  }

  get username() {
    return this._username;
  }

  get driveStyle() {
    return driveStyles[this._driveStyle];
  }

  get roles() {
    return rolesToString(this._roles);
  }

  get cars() {
    return this._cars;
  }

  get routes() {
    return this._routes;
  }

  isAdmin() {
    return this._roles.includes('ROLE_ADMIN');
  }
}


export const userSchema = new Schema('users');

export const getUsersFromResponseData = data => {
  const users = data['_embedded'] ? data['_embedded'] : {};

  const normalized = normalize(users, { users: arrayOf(userSchema) });

  const entities = mapValues(normalized.entities.users, u => new PathUser(u));
  const result = normalized.result.users;

  return {
    entities,
    result
  };
};
