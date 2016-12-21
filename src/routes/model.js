import Entity from '../utils/Entity';
import { Schema, arrayOf, normalize } from 'normalizr';
import mapValues from 'lodash/mapValues';


export class PathRoute extends Entity {
  constructor({id, name, createdAt, updatedAt, nodes, edges, _links}) {
    super(id, createdAt, updatedAt, _links);

    this._name = name;

    this._nodes = nodes;
    this._edges = edges;
  }

  get name() {
    return this._name;
  }

  get nodes() {
    return this._nodes;
  }

  get edges() {
    return this._edges;
  }
}


export class PathNode extends Entity {
  constructor({ id, position, light, _links }) {
    super(id, null, null, _links);

    this._id = id;

    if (position) {
      this._x = position.x;
      this._y = position.y;
    }

    this._light = light;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
  }

  get light() {
    return this._light;
  }

  set light(light) {
    this._light = {
      redPhase: light.redPhase,
      greenPhase: light.greenPhase
    };
  }
}


export class PathEdge extends Entity {
  constructor({ id, from, to, directed, lanes, length, coverType, _links }) {
    super(id, null, null, _links);

    this._id = id;

    this._from = from;
    this._to = to;

    this._directed = directed;
    this._lanes = lanes;
    this._length = length;

    this._coverType = coverType;
  }


  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get from() {
    return this._from;
  }

  set from(value) {
    this._from = value;
  }

  get to() {
    return this._to;
  }

  set to(value) {
    this._to = value;
  }

  get directed() {
    return this._directed;
  }

  set directed(value) {
    this._directed = value;
  }

  get lanes() {
    return this._lanes;
  }

  set lanes(value) {
    this._lanes = value;
  }

  get length() {
    return this._length;
  }

  set length(value) {
    this._length = value;
  }

  get coverType() {
    return { ...this._coverType };
  }

  set coverType(value) {
    this._coverType = {
      name: value.name,
      slowdown: value.slowdown
    };
  }
}


export const routesSchema = new Schema('routes');

export const nodesSchema = new Schema('nodes');
export const edgesSchema = new Schema('edges');

routesSchema.define({
  nodes: arrayOf(nodesSchema),
  edges: arrayOf(edgesSchema)
});

export const getRoutesFromResponseData = (data) => {
  const routes = data['_embedded'] ? data['_embedded'] : {};

  const normalized = normalize(routes, {
    routes: arrayOf(routesSchema)
  });

  const entities = mapValues(normalized.entities.routes, r => new PathRoute(r));
  const result = normalized.result.routes;

  return {
    entities,
    result
  };
};

export const getRouteFromResponseData = (data) => {
  const normalized = normalize(data, routesSchema);

  const entities = {
    routes: mapValues(normalized.entities.routes, r => new PathRoute(r)),
    edges: mapValues(normalized.entities.edges, e => new PathEdge(e)),
    nodes: mapValues(normalized.entities.nodes, n => new PathNode(n))
  };

  return {
    entities,
    result: normalized.result
  };
};
