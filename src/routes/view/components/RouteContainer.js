import React from 'react';
import RouteToolbar from './RouteToolbar';
import vis from 'vis';
import values from 'lodash/values';


export default class RouteContainer extends React.Component {
  createNetworkNode = pathNode => {
    const node = {
      id: pathNode.id,
      x: pathNode.x,
      y: pathNode.y,
      light: pathNode.light
    };

    if (pathNode.light) {
      node.shape = 'circularImage';
      node.image = '../images/traffic-light.png';
      node.label = `${pathNode.light.redPhase} ${pathNode.light.greenPhase}`;
    }

    return node;
  };

  createNetworkEdge = pathEdge => {
    const edge = {
      id: pathEdge.id,
      from: pathEdge.from,
      to: pathEdge.to,
      value: pathEdge.lanes,
      length: pathEdge.length,
      coverType: pathEdge.coverType,

    };

    if (pathEdge.directed) {
      edge.arrows = 'to';
    }

    return edge;
  };


  updateNodesValue = () => {
    this.data.nodes.get().forEach(node => {
      node.value = this.network.getConnectedEdges(node.id)
        .reduce((prev, edgeId) => prev + this.data.edges.get(edgeId).value, 5);

      this.data.nodes.update(node);
    });
  };


  componentDidMount() {
    this.data = {
      nodes: new vis.DataSet(),
      edges: new vis.DataSet()
    };


    const options = {
        nodes: {
          shape: 'dot',
          borderWidthSelected: 4,
          scaling:{
            label: {
              min: 14,
              max: 20
            }
          },
          font: {
            color: 'red'
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
          font: { size: 18, align: 'middle' }
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
        },
        // manipulation: {
        //   enabled: false,
        //   addNode: (nodeData, callback) => {
        //     this.setState({
        //       activeView: ''
        //     });
        //     this.forceUpdate();
        //
        //     callback(nodeData);
        //   }
        // }
      };

    this.network = new vis.Network(this.refs.route, this.data, options);

    const arrows = "⟷";//;"⟷↔⟺⟸⟹";fafs

    this.props.loadRoute(this.props.id || this.props.method)
      .then(route => {
        this.data.edges.add(values(route.entities.edges).map(this.createNetworkEdge));
        this.data.nodes.add(values(route.entities.nodes).map(this.createNetworkNode));

        this.updateNodesValue();

        this.forceUpdate();

        // console.log(this.data);

        // const data = { nodes, edges
        // };
        //
        // const options = {
        //   nodes: {
        //     shape: 'dot',
        //     scaling:{
        //       label: {
        //         min: 14,
        //         max: 20
        //       }
        //     },
        //     color: {
        //       border: '#7c29f0',
        //       background: '#ad85e4',
        //       highlight: {
        //         border: '#7c29f0',
        //         background: '#d3bdf0'
        //       }
        //     }
        //   },
        //   edges: {
        //     color: {
        //       inherit: 'from'
        //     },
        //     smooth: false
        //   },
        //   layout: {
        //     randomSeed: 0
        //   },
        //   physics: {
        //     enabled: false
        //   },
        //   interaction: {
        //     navigationButtons: true,
        //     keyboard: true
        //   },
        //   // manipulation: {
        //   //   enabled: false,
        //   //   addNode: (nodeData, callback) => {
        //   //     this.setState({
        //   //       activeView: ''
        //   //     });
        //   //     this.forceUpdate();
        //   //
        //   //     callback(nodeData);
        //   //   }
        //   // }
        // };
        //
        // this.network = new vis.Network(this.refs.route, data, options);
        // // this.network.on("selectNode", event => {
        // //   this.setState({
        // //     activeView: 'selectedNode',
        // //     selected: event.nodes
        // //   });
        // //
        // //   this.forceUpdate();
        // // });
        //
        // this.forceUpdate();
        //this.props.loadNetwork(network);
        //
        // setTimeout(() => {
        //   console.log('mode');
        //   network.addNodeMode();
        // }, 500);
      });


    // const nodes = [fsdf
    //   {id: 1,  value: 2, x: 0, y: 100, label: "25\t40"},
    //   {id: 2,  value: 31, x: 50, y: 100, label: "25\t40"},
    //   {id: 3,  value: 12, x: 100, y: 100, color:'#FFFF00'},
    //   {id: 4,  value: 16, x: 150, y: 100},
    //   {id: 5,  value: 17},
    //   {id: 6,  value: 15},
    //   {id: 7,  value: 6},
    //   {id: 8,  value: 6},
    //   {id: 9,  value: 30},
    //   {id: 10, value: 18},
    // ];
    //
    // // create connections between peoplefdasfsf
    // // value corresponds with the amount of contact between two peofsfsdfple
    // const edges = [
    //   {from: 2, to: 8, value: 6, label: 'Гравий\nГовно', font: {align: 'middle'} },
    //   {from: 8, to: 2, value: 1, arrows: { to: true, arrowStrikethrough: true } },
    //   {from: 2, to: 9, value: 5, arrows: { to: true, arrowStrikethrough: true } },
    //   {from: 2, to: 10,value: 1 },
    //   {from: 4, to: 6, value: 8 },
    //   {from: 5, to: 7, value: 2, arrows: { to: true, arrowStrikethrough: true } },
    //   {from: 4, to: 5, value: 1 },
    //   {from: 9, to: 10,value: 2 },
    //   {from: 2, to: 3, value: 6 },
    //   {from: 3, to: 9, value: 4 },
    //   {from: 5, to: 3, value: 1 },
    //   {from: 2, to: 7, value: 4 }
    // ];
    //
    // // Instantiate our network object. dfsdfsfsd
    // const container = document.getElementById('my-graph'); // TODOdsfs
    //
    // console.log(container);
    //
    // const data = {
    //   nodes,
    //   edgesfsdf
    // };
  }

  shouldComponentUpdate() {
    return false;
  }

  handleAddNodeClick = () => {
    this.network.addNodeMode();
    this.setState({
      activeView: 'addNode'
    });

    this.forceUpdate();
  };

  handleAddNodeCancel = () => {
    this.network.disableEditMode();
    this.setState({
      activeView: ''
    });

    this.forceUpdate();
  };

  render() {
    return (
      <div className="route-view">
        <div className="route-toolbar">
          {this.network &&
            <RouteToolbar network={this.network} nodes={this.data.nodes} edges={this.data.edges} />
          }
        </div>
        <div className="route-container">
          <div id="route-drawer" style={{ width: '100%', height: '100%' }} ref="route"/>
        </div>
      </div>
    );
  }
}

RouteContainer.propTypes = {
  id: React.PropTypes.string,
  method: React.PropTypes.string,
  loadRoute: React.PropTypes.func.isRequired,
  loadNetwork: React.PropTypes.func.isRequired
};
