import React, { Component, PropTypes } from 'react';
import RouteUndoToolbar from './RouteUndoToolbar';
import RouteInfoPanel from './RouteInfoPanel';
import RouteSave from './RouteSave';
import RouteNodeEdit from './RouteNodeEdit';
import RouteEdgeEdit from './RouteEdgeEdit';
import RouteSettings from './RouteSettings';
import RouteSearchPath from './RouteSearchPath';
import vis from 'vis';
import { networkOptions } from '../constants';


class RouteView extends Component {
  static propTypes = {
    loadCaches: PropTypes.func.isRequired,
    loadCars: PropTypes.func.isRequired,
    loadRoute: PropTypes.func.isRequired,
    deleteRoute: PropTypes.func.isRequired,
    storeRoute: PropTypes.func.isRequired,
    findPath: PropTypes.func.isRequired,
    settings: PropTypes.object,
    nodes: PropTypes.object,
    edges: PropTypes.object,
    addNode: PropTypes.func.isRequired,
    addEdge: PropTypes.func.isRequired,
    updateNode: PropTypes.func.isRequired,
    setFrom: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
    from: PropTypes.string,
    to: PropTypes.string,
    path: PropTypes.shape({
      cost: PropTypes.number.isRequired,
      path: PropTypes.array.isRequired
    }),
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
    searchShown: false,
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
      || this.props.edges !== nextProps.edges) || (this.props.settings !== nextProps.settings)
      || this.props.from !== nextProps.from || this.props.to !== nextProps.to)) {
      const { nodes, edges } = this.data;

      nodes.update(Object.keys(nextProps.nodes)
        .map(k => nextProps.nodes[k])
        .map(this.nodeMapper(nextProps.settings, nextProps.from, nextProps.to)));
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

    this.data.edges.get().forEach(e => this.data.edges.update({ ...e, color: null }));

    if (nextProps.path) {
      for (let i = 1; i < nextProps.path.path.length; i++) {
        const edge = this.data.edges.get({
          filter: e => (e.from === nextProps.path.path[i - 1] && e.to === nextProps.path.path[i])
            || (!e.directed && e.to === nextProps.path.path[i -1] && e.from === nextProps.path.path[i])
        })[0];
        this.data.edges.update({ ...edge, color: 'orange' });
      }
    }
  }


  nodeMapper = (settings, from, to) => n => {
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

    if (from === node.id) {
      node.color = 'blue';
    } else if (to === node.id) {
      node.color = 'red';
    } else {
      node.color = null;
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
      label.push(`Тип покрытия: ${edge.coverType.coverTypeName}`);
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
      label.push(`${edge.policeman} патрульный`);
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

      if (this.data.edges.get({ filter }).length > 1 || (edge.from === edge.to)) {
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

  onSettingsClick = () => this.setState({
    settingsShown: !this.state.settingsShown,
    searchShown: false
  });

  onSaveClick = () => this.setState({ saveMode: true });

  onDeleteClick = () => this.props.deleteRoute();

  onPathClick = () => this.props.loadCars().then(() =>
    this.setState({ settingsShown: false, searchShown: !this.state.searchShown }));

  onFromClick = () => {
    const handler = event => {
      if (event.nodes.length > 0 && event.nodes[0] !== this.props.to) {
        this.network.off('click', handler);
        this.props.setFrom(event.nodes[0]);
      }
    };

    this.network.on('click', handler);
  };

  onToClick = () => {
    const handler = event => {
      if (event.nodes.length > 0 && event.nodes[0] !== this.props.from) {
        this.network.off('click', handler);
        this.props.setTo(event.nodes[0]);
      }
    };

    this.network.on('click', handler);
  };


  render() {
    const {
      editModeText, nodeSelected, edgeSelected, settingsShown, searchShown, saveMode
    } = this.state;

    return (
      <div className="route-view">
        <RouteUndoToolbar disabled={!!editModeText || saveMode}
                          onAddNodeClick={this.onAddNodeClick}
                          onAddEdgeClick={this.onAddEdgeClick}
                          onSaveClick={this.onSaveClick}
                          onDeleteClick={this.onDeleteClick}
                          onPathClick={this.onPathClick}
                          onSettingsClick={this.onSettingsClick}/>

        {editModeText && <RouteInfoPanel message={editModeText} onDecline={this.onDecline}/>}
        {nodeSelected && !searchShown && <RouteNodeEdit node={nodeSelected} onCancel={this.onDecline}/>}
        {edgeSelected && !searchShown && <RouteEdgeEdit edge={edgeSelected} onCancel={this.onDecline}/>}
        {settingsShown && <RouteSettings/>}
        {searchShown && <RouteSearchPath chooseFrom={this.onFromClick} chooseTo={this.onToClick}/>}
        {saveMode && <RouteSave onCancel={this.onDecline}/>}
        <div className="route-container">
          <div id="route-drawer" style={{ width: '100%', height: '100%' }} ref="route"/>
        </div>
      </div>
    );
  }
}

export default RouteView;
