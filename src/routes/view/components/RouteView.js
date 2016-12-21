import React, { Component, PropTypes } from 'react';
import RouteUndoToolbar from './RouteUndoToolbar';
import RouteInfoPanel from './RouteInfoPanel';
import RouteSave from './RouteSave';
import RouteNodeEdit from './RouteNodeEdit';
import RouteEdgeEdit from './RouteEdgeEdit';
import RouteSettings from './RouteSettings';
import vis from 'vis';
import { networkOptions } from '../constants';
import * as policemen from '../model';


class RouteView extends Component {
  static propTypes = {
    loadCaches: PropTypes.func.isRequired,
    loadRoute: PropTypes.func.isRequired,
    findPath: PropTypes.func.isRequired,
    settings: PropTypes.object,
    nodes: PropTypes.object,
    edges: PropTypes.object,
    addNode: PropTypes.func.isRequired,
    addEdge: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
    params: PropTypes.shape({
      routeId: PropTypes.string
    }).isRequired,
    route: PropTypes.shape({
      path: PropTypes.string
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.data = {
      nodes: new vis.DataSet(),
      edges: new vis.DataSet()
    };
  }

  state = {
    editModeText: null,
    nodeSelected: null,
    edgeSelected: null,
    settingsShown: false,
    saveMode: false
  };

  componentWillMount() {
    if (this.props.params.routeId) {
      this.routeId = this.props.params.routeId;
    } else {
      this.routeId = this.props.route.path;
    }
  }

  componentDidMount() {
    this.props.loadCaches()
      .then(() => this.props.loadRoute(this.routeId))
      .then(() => {
        this.network = new vis.Network(this.refs.route, this.data, networkOptions);
        this.network.on('click', event => {
          if (event.nodes.length > 0) {
            this.setState({
              nodeSelected: this.nodeTransformer(this.data.nodes.get(event.nodes[0])),
              edgeSelected: null
            });
          } else if (event.edges.length > 0) {
            this.setState({
              nodeSelected: null,
              edgeSelected: this.edgeTransformer(this.data.edges.get(event.edges[0]))
            });
          } else {
            this.setState({
              nodeSelected: null,
              edgeSelected: null
            });
          }
        });

        this.network.on('dragEnd', event => {
          if (event.nodes.length > 0) {
            const nodeId = event.nodes[0];
            const position = this.network.getPositions([nodeId]);
            const node = this.data.nodes.get(nodeId);
            this.props.updateNode(this.nodeMapper(this.props.settings)({
              ...node,
              ...position[nodeId]
            }));
          }
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nodes && nextProps.edges && ((this.props.nodes !== nextProps.nodes
      || this.props.edges !== nextProps.edges) || (this.props.settings !== nextProps.settings))) {
      const { nodes, edges } = this.data;

      nodes.update(Object.keys(nextProps.nodes)
        .map(k => nextProps.nodes[k])
        .map(this.nodeMapper(nextProps.settings)));
      edges.update(Object.keys(nextProps.edges)
        .map(k => nextProps.edges[k])
        .map(this.edgeMapper(nextProps.settings)));

      nodes.remove(nodes.get({
        filter: node => !nextProps.nodes.hasOwnProperty(node.id)
      }));
      edges.remove(edges.get({
        filter: edge => !nextProps.edges.hasOwnProperty(edge.id)
      }));
    }
  }

  nodeMapper = settings => n => {
    const node = {
      id: n.id,
      light: n.light,
      x: n.x,
      y: n.y
    };

    if (node.light) {
      node.label = `${node.light.redPhase} ${node.light.greenPhase}`;

      if (settings.lights) {
        node.shape = 'circularImage';
        node.image = '../images/traffic-light.png';
      } else {
        node.shape = 'dot';
      }
    } else {
      node.label = null;
      node.shape = 'dot';
    }

    return node;
  };

  nodeTransformer = n => ({
    id: n.id,
    x: n.x,
    y: n.y,
    light: n.light
  });

  edgeMapper = settings => e => {
    const edge = {
      id: e.id,
      from: e.from,
      to: e.to,
      directed: e.directed,
      length: e.length,
      coverType: e.coverType,
      limit: e.limit,
      street: e.street,
      traffic: e.traffic,
      policeman: e.policeman
    };

    if (edge.directed) {
      edge.arrows = 'to';
    } else {
      edge.arrows = '';
    }

    const label = [];

    if (settings.length && edge.length) {
      label.push(`Длина: ${edge.length}м`);
    }

    if (settings.coverTypes && edge.coverType) {
      label.push(`Тип покрытия: ${edge.coverType.coverTypeName}(${edge.coverType.slowdown})`);
    }

    if (settings.streetNames && edge.street) {
      label.push(`${edge.street.streetType} ${edge.street.streetName}`);
    }

    if (settings.limits && edge.limit) {
      label.push(`Ограничение скорости: ${edge.limit}км/ч`);
    }

    if (settings.traffic && edge.traffic && edge.traffic !== edge.limit) {
      label.push(`Пробка: ${edge.traffic}км/ч`);
    }

    if (settings.police && edge.policeman) {
      label.push(`${edge.policeman.locale} патрульный`);
    }

    edge.label = label.join('\n');

    return edge;
  };

  edgeTransformer = e => ({
    id: e.id,
    from: e.from,
    to: e.to,
    directed: e.directed,
    length: e.length,
    limit: e.limit,
    coverType: e.coverType,
    street: e.street,
    traffic: e.traffic,
    policeman: e.policeman
  });




  createNetworkNode = (n, initial = false) => {
    const { settings } = this.props;

    const node = {
      id: n.id,
      light: n.light
    };

    if (initial) {
      node.x = n.position.x;
      node.y = n.position.y;
    } else {
      node.x = undefined;
      node.y = undefined;
    }

    if (node.light) {
      node.label = `${node.light.redPhase} ${node.light.greenPhase}`;

      if (settings.lights) {
        node.shape = 'circularImage';
        node.image = '../images/traffic-light.png';
      } else {
        node.shape = 'dot';
      }
    } else {
      node.shape = 'dot';
      node.label = null;
    }

    if (settings.scaleNodes) {
      node.value = n.value ? n.value : 0;
    } else {
      node.value = 0;
    }

    return node;
  };

  createNetworkEdge = e => {
    const { settings } = this.props;

    const edge = {
      id: e.id,
      from: e.from,
      to: e.to,
      directed: e.directed,
      lanes: e.lanes,
      length: e.length,
      coverType: e.coverType,
      limit: e.limit,
      street: e.street,
      traffic: e.traffic,
      policeman: e.policeman
    };

    if (edge.directed) {
      edge.arrows = 'to';
    }

    let label = '';

    if (settings.scaleEdges && edge.lanes) {
      edge.value = edge.lanes;
      label += `Полос: ${edge.lanes}\n`;
    } else {
      edge.value = 0;
    }

    if (settings.length && edge.length) {
      label += `Длина: ${edge.length}м\n`;
    }

    if (settings.coverTypes && edge.coverType) {
      label += `Тип покрытия: ${edge.coverType.coverTypeName}(${edge.coverType.slowdown})\n`;
    }

    if (settings.streetNames && edge.street) {
      label += `${edge.street.streetType} ${edge.street.streetName}\n`;
    }

    if (settings.limits && edge.limit) {
      label += `Ограничение скорости: ${edge.limit}км/ч\n`;
    }

    if (settings.traffic && edge.traffic && edge.traffic !== edge.limit) {
      label += `Пробка: ${edge.traffic}км/ч\n`;
    }

    if (settings.police && edge.policeman) {
      label += `${edge.policeman.locale} патрульный`;
    }

    edge.label = label;

    return edge;
  };




  onAddNodeClick = () => {
    const onAddCallback = (event, props) => {
      this.data.nodes.off('add', onAddCallback);
      this.props.addNode(this.nodeTransformer(this.data.nodes.get(props.items[0])));
      this.setState({
        editModeText: null
      });
    };

    this.data.nodes.on('add', onAddCallback);
    this.setState({
      editModeText: 'Кликните в любое место на карте для создания нового перекрестка'
    });
    this.network.addNodeMode();
  };

  onAddEdgeClick = () => {
    const onAddCallback = (event, props) => {
      this.data.edges.off('add', onAddCallback);

      const edge = this.data.edges.get(props.items[0]);
      const filter = e => ((e.from === edge.from && e.to === edge.to) ||
        (e.from === edge.to && e.to === edge.from));

      if (this.data.edges.get({ filter }).length > 1) {
        this.data.edges.remove(edge);
      } else {
        this.props.addEdge(this.edgeTransformer(edge));
      }

      this.setState({
        editModeText: null
      });
    };

    this.data.edges.on('add', onAddCallback);
    this.setState({
      editModeText: 'Соедините два перекрестка между собой'
    });
    this.network.addEdgeMode();
  };

  onDecline = () => {
    this.setState({
      editModeText: null,
      nodeSelected: null,
      edgeSelected: null,
      saveMode: false
    });
    this.network.disableEditMode();
  };

  onSettingsClick = () => this.setState({ settingsShown: !this.state.settingsShown });

  onSaveClick = () => this.setState({ saveMode: true });



  onNodeAdd = cb => {
    const onAdd = (evt, props) => {
      this.data.nodes.off('add', onAdd);

      const node = this.data.nodes.get(props.items[0]);
      node.label = '';

      this.data.nodes.update(node);

      cb();
    };
    this.data.nodes.on('add', onAdd);

    this.network.addNodeMode();
  };

  onEdgeAdd = cb => {
    const onAdd = (evt, props) => {
      this.data.edges.off('add', onAdd);

      const edge = this.data.edges.get(props.items[0]);

      const cloned = this.data.edges.get({
        filter: e => (e.from === edge.from && e.to === edge.to)
          || (e.to === edge.from && e.from === edge.to)
      });

      if (cloned.length > 1) {
        this.data.edges.remove(edge);
        cb();
        return;
      }

      edge.directed = false;
      edge.length = 100;
      edge.lanes = 1;
      edge.limit = 60;

      this.data.edges.update(this.createNetworkEdge(edge));

      cb();
    };
    this.data.edges.on('add', onAdd);

    this.network.addEdgeMode(); //gdfsdfsd
  };

  onCancel = () => {
    this.network.disableEditMode();
  };


  onSelect = cb => {
    this.network.on('click', event => {
      if (event.nodes.length > 0) {
        cb('node', this.data.nodes.get(event.nodes[0]));
      } else if (event.edges.length > 0) {
        cb('edge', this.data.edges.get(event.edges[0]));
      } else {
        cb();
      }
    });
  };


  onNodeSave = (n, cb) => {
    const node = this.data.nodes.get(n.id);

    if (n.hasLight) {
      node.light = {
        redPhase: n.redPhase,
        greenPhase: n.greenPhase
      };
    } else {
      node.light = undefined;
      node.label = undefined;
    }
    this.data.nodes.update(this.createNetworkNode(node));

    cb();
  };

  onNodeDelete = (n, cb) => {
    const connectedEdges = this.network.getConnectedEdges(n.id);

    this.data.edges.remove(connectedEdges);
    this.data.nodes.remove(n);

    cb();
  };

  onEdgeSave = (e, cb) => {
    const edge = this.data.edges.get(e.id);

    edge.directed = e.directed;
    if (e.lanes) {
      edge.lanes = e.lanes;
    }

    if (e.length) {
      edge.length = e.length;
    }

    if (e.limit) {
      edge.limit = e.limit;
    }

    if (e.coverType) {
      edge.coverType = e.coverType;
    }

    if (e.street) {
      edge.street = e.street;
    }

    if (e.policeman) {
      if (policemen.greedyPoliceman.name === e.policeman) {
        edge.policeman = policemen.greedyPoliceman;
      } else if (policemen.honestPoliceman.name === e.policeman) {
        edge.policeman = policemen.honestPoliceman;
      } else if (policemen.slowPoliceman.name === e.policeman) {
        edge.policeman = policemen.slowPoliceman;
      }
    }

    if (e.traffic) {
      edge.traffic = e.traffic;
    }


    this.data.edges.update(this.createNetworkEdge(edge));
    cb();
  };

  onEdgeDelete = (e, cb) => {
    this.data.edges.remove(e);
    cb();
  };

  chooseFrom = cb => {
    const handler = event => {
      if (event.nodes.length > 0) {
        const old = cb(event.nodes[0]);

        if (old === undefined) {
          return;
        }

        const node = this.data.nodes.get(event.nodes[0]);
        node.color = '#0000ff';

        this.data.nodes.update(node);

        const oldNode = this.data.nodes.get(old);
        if (oldNode && oldNode.color) {
          oldNode.color = undefined;
          this.data.nodes.update(oldNode);
        }
      } else {
        this.network.once('click', handler);
      }
    };

    this.network.once('click', handler);
  };

  chooseTo = cb => {
    const handler = event => {
      if (event.nodes.length > 0) {
        const old = cb(event.nodes[0]);

        if (old === undefined) {
          return;
        }

        const node = this.data.nodes.get(event.nodes[0]);
        node.color = '#FF0000';

        this.data.nodes.update(node);

        const oldNode = this.data.nodes.get(old);

        // console.log(old, oldNode);

        if (old && oldNode && oldNode.color) {
          oldNode.color = {};
          this.data.nodes.update(this.createNetworkNode(oldNode));
        }
      } else {
        this.network.once('click', handler);
      }
    };

    this.network.once('click', handler);
  };


  render() {
    const { editModeText, nodeSelected, edgeSelected, settingsShown, saveMode } = this.state;

    return (
      <div className="route-view">
        <RouteUndoToolbar disabled={!!editModeText || saveMode}
                          onAddNodeClick={this.onAddNodeClick}
                          onAddEdgeClick={this.onAddEdgeClick}
                          onSaveClick={this.onSaveClick}
                          onSettingsClick={this.onSettingsClick}/>

        {editModeText && <RouteInfoPanel message={editModeText} onDecline={this.onDecline}/>}
        {nodeSelected && <RouteNodeEdit node={nodeSelected} onCancel={this.onDecline}/>}
        {edgeSelected && <RouteEdgeEdit edge={edgeSelected} onCancel={this.onDecline}/>}
        {settingsShown && <RouteSettings/>}
        {saveMode && <RouteSave onCancel={this.onDecline}/>}

        {/*<div className="route-toolbar">*/}
          {/*{this.network &&*/}
            {/*<RouteToolbar onNodeAdd={this.onNodeAdd}*/}
                          {/*onEdgeAdd={this.onEdgeAdd}*/}
                          {/*onCancel={this.onCancel}*/}
                          {/*onSelect={this.onSelect}*/}
                          {/*onNodeSave={this.onNodeSave}*/}
                          {/*onNodeDelete={this.onNodeDelete}*/}
                          {/*onEdgeSave={this.onEdgeSave}*/}
                          {/*onEdgeDelete={this.onEdgeDelete}*/}
                          {/*chooseFrom={this.chooseFrom}*/}
                          {/*chooseTo={this.chooseTo}*/}
                          {/*findPath={this.props.findPath.bind(null, this.data.nodes, this.data.edges)}/>*/}
          {/*}*/}
        {/*</div>*/}
        <div className="route-container">
          <div id="route-drawer" style={{ width: '100%', height: '100%' }} ref="route"/>
        </div>
      </div>
    );
  }
}

export default RouteView;
