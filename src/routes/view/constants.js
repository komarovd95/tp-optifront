export const EXAMPLE_NODES = [];

export const EXAMPLE_EDGES = [];

export const EXAMPLE = null;


export const networkOptions = {
  nodes: {
    shape: 'dot',
    borderWidthSelected: 3,
    scaling:{
      label: {
        min: 12,
        max: 16
      }
    },
    color: {
      border: '#7c29f0',
      background: '#ad85e4',
      highlight: {
        border: '#7c29f0',
        background: '#d3bdf0'
      }
    }
  },
  edges: {
    color: {
      highlight: '#7c29f0'
    },
    smooth: false,
    font: { size: 12, align: 'middle' },
    value: 2
  },
  layout: {
    randomSeed: 0
  },
  physics: {
    enabled: false
  },
  interaction: {
    navigationButtons: true,
    keyboard: true
  }
};
