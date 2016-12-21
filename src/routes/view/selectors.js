import { createSelector } from 'reselect';


const getNodes = state => state.routes.view.route.nodes;
const getSettings = state => state.routes.view.settings;

export const getNetworkNodes = createSelector(getNodes, getSettings, (nodes, settings) =>
  nodes.map(({ id, x, y, light }) => {
    const node = { id, x, y };

    if (light) { // TODO light --> node
      node.label = `${light.redPhase} ${light.greenPhase}`;

      if (settings.lights) {
        node.shape = 'circularImage';
        node.image = '../images/traffic-light.png';
      }
    }

    return node;
  })
);


const getEdges = state => state.routes.view.route.edges;

export const getNetworkEdges = createSelector(getEdges, getSettings, (edges, settings) =>
  edges.map(({ id, from, to, lanes, length, coverType, directed, street, limit }) => {
    const edge = { id, from, to };

    if (directed) {
      edge.arrows = 'to';
    }

    if (lanes && settings.scaleEdges) {
      edge.value = lanes;
    }

    let label = '';

    if (length && settings.length) {
      label = label + `Длина: ${length}\n`;
    }

    if (coverType && settings.coverTypes) {
      label = label + `Тип покрытия: ${coverType.coverTypeName}(${coverType.slowdown})\n`;
    }

    if (label) {
      edge.label = label;
    }

    return edge;
  })
);
