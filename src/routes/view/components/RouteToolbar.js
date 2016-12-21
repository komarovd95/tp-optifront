import React, { Component, PropTypes } from 'react';
import Accordion from '../../../commons/Accordion';
import RouteDefaultView from './RouteDefaultView';
import RouteAddView from './RouteAddView';
import RouteNodeEditView from './RouteNodeEditView';
import RouteEdgeEditView from './RouteEdgeEditView';
import RouteStateView from './RouteStateView';
import RouteOptiView from './RouteOptiView';
import RouteSettingsView from './RouteSettingsView';


class RouteToolbar extends Component {
  static propTypes = {
    onNodeAdd: PropTypes.func.isRequired,
    onEdgeAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onNodeSave: PropTypes.func.isRequired,
    onNodeDelete: PropTypes.func.isRequired,
    onEdgeSave: PropTypes.func.isRequired,
    onEdgeDelete: PropTypes.func.isRequired,
    chooseFrom: PropTypes.func.isRequired,
    chooseTo: PropTypes.func.isRequired,
    findPath: PropTypes.func.isRequired,
  };

  state = {
    activeView: '',
    selected: null
  };


  componentDidMount() {
    this.props.onSelect(this.onSelect);
  }


  onNodeAdd = () => {
    this.setState({
      activeView: 'addNode'
    });

    this.props.onNodeAdd(() => this.setState({
      activeView: ''
    }));
  };

  onEdgeAdd = () => {
    this.setState({
      activeView: 'addEdge'
    });

    this.props.onEdgeAdd(() => this.setState({
      activeView: ''
    }));
  };

  onCancel = () => {
    this.setState({
      activeView: ''
    });

    this.props.onCancel();
  };

  onSelect = (type, item) => {
    if (type === 'node') {
      this.setState({
        activeView: 'selectNode',
        selected: item
      });
    } else if (type === 'edge') {
      this.setState({
        activeView: 'selectEdge',
        selected: item
      });
    } else if (this.state.activeView) {
      this.setState({
        activeView: '',
        selected: null
      });
    }
  };

  onNodeSave = node => {
    this.props.onNodeSave(node, this.onReset);
  };

  onNodeDelete = () => {
    this.props.onNodeDelete(this.state.selected, this.onReset);
  };

  onEdgeSave = edge => {
    this.props.onEdgeSave(edge, this.onReset);
  };

  onEdgeDelete = () => {
    this.props.onEdgeDelete(this.state.selected, this.onReset);
  };


  onReset = () => {
    this.setState({
      activeView: '',
      selected: null
    });
  };

  render() {
    let nodeView = null;

    switch (this.state.activeView) {
      case "addNode":
        nodeView = <RouteAddView type="node" onCancel={this.onCancel}/>;
        break;

      case "addEdge":
        nodeView = <RouteAddView type="edge" onCancel={this.onCancel}/>;
        break;

      case "selectNode":
        nodeView = (<RouteNodeEditView node={this.state.selected}
                                       nodeSave={this.onNodeSave}
                                       nodeDelete={this.onNodeDelete}
                                       resetCallback={this.onReset}/>);
        break;

      case "selectEdge":
        nodeView = (<RouteEdgeEditView edge={this.state.selected}
                                       edgeSave={this.onEdgeSave}
                                       edgeDelete={this.onEdgeDelete}
                                       resetCallback={this.onReset}/>);
        break;

      default:
        nodeView = (<RouteDefaultView onNodeAddClick={this.onNodeAdd}
                                      onEdgeAddClick={this.onEdgeAdd}/>);
        break;
    }


    return (
      <Accordion className="styled">
        <div className="title">
          <i className="options icon"/> Редактировать
        </div>
        <div className="content">
          {nodeView}
        </div>
        <div className="title">
          <i className="fork icon"/> Оптимальный маршрут
        </div>
        <div className="content">
          {this.state.activeView === 'selectEdge' && this.state.selected && (
            <RouteStateView edge={this.state.selected} stateSave={this.onEdgeSave}/>
          )}
          <RouteOptiView chooseFrom={this.props.chooseFrom}
                         chooseTo={this.props.chooseTo} findPath={this.props.findPath}/>
        </div>
        <div className="title">
          <i className="settings icon"/> Настройки
        </div>
        <div className="content">
          <RouteSettingsView/>
        </div>
        <div className="title">
          <i className="save icon"/> Сохранить
        </div>
        <div className="content">
          <div className="ui vertical basic fluid buttons">
            <button className="ui button">
              <i className="sitemap icon"/> Добавить перекресток
            </button>
            <button className="ui button">
              <i className="road icon"/> Добавить участок дорогиdfs
            </button>
          </div>
        </div>
      </Accordion>
    );
  }
}

export default RouteToolbar;

// export default class RouteToolbar extends React.Component {
//   state = {
//     activeView: '',
//     selected: null
//   };
//
//   // componentWillReceiveProps(nextProps) {
//   //   if (!this.props.network && nextProps.network) {
//   //     nextProps.network.manipulation.options = {
//   //       enabled: false,
//   //       addNode: (node, cb) => {
//   //         this.setState({
//   //           activeView: ''
//   //         });
//   //
//   //         node.value = 1;
//   //         node.label = null;
//   //
//   //         cb(node);
//   //       }
//   //     };
//   //
//   //     nextProps.network.on('selectNode', event => {
//   //       this.setState({
//   //         activeView: 'selectNode',
//   //         selected: event.nodes
//   //       });
//   //     });
//   //
//   //     nextProps.network.on('deselectNode', event => {
//   //       this.setState({
//   //         activeView: '',
//   //         selected: null
//   //       });
//   //     })
//   //   }
//   // }sffs
//
//   componentDidMount() {
//     const { network, nodes, edges } = this.props;
//
//     network.on('click', event => {
//       if (event.nodes.length > 0) {
//         this.setState({
//           activeView: 'selectNode',
//           selected: nodes.get(event.nodes[0])
//         });
//       } else if (event.edges.length > 0) {
//         this.setState({
//           activeView: 'selectEdge',
//           selected: edges.get(event.edges[0])
//         });
//       } else if (this.state.activeView) {
//         this.setState({
//           activeView: '',
//           selected: null
//         });
//       }
//     });
//
//     nodes.on("*", () => network.storePositions());
//     edges.on("*", () => network.storePositions());
//
//     nodes.on('add', (event, { items }) => {
//       this.setState({
//         activeView: ''
//       });
//
//       const node = nodes.get(items[0]);
//
//       node.value = 0;
//       node.label = null;
//
//       nodes.update(node);
//     });
//
//     edges.on('add', (event, { items }) => {
//       this.setState({
//         activeView: ''
//       });
//
//       const edge = edges.get(items[0]);
//
//       edge.value = 1;
//
//       const [nodeFrom, nodeTo] = nodes.get([edge.to, edge.from]);
//
//       nodeFrom.value++;
//       nodeTo.value++;
//
//       nodes.update([nodeFrom, nodeTo]);
//       edges.update(edge);
//     });
//   }
//
//
//   handleAddNodeClick = () => {
//     this.props.network.addNodeMode();
//     this.setState({
//       activeView: 'addNode'
//     });
//   };
//
//   handleAddNodeCancel = () => {
//     this.props.network.disableEditMode();
//     this.setState({
//       activeView: ''
//     });
//   };
//
//   handleAddEdgeClick = () => {
//     this.props.network.addEdgeMode();
//     this.setState({
//       activeView: 'addEdge'
//     });
//   };
//
//   handleAddEdgeCancel = () => {
//     this.props.network.disableEditMode();
//     this.setState({
//       activeView: ''
//     });
//   };
//
//
//
//   renderAddNode = () => {
//     return (
//       <div className="ui fluid">
//         <p>Кликните в любое место на карте для создания нового перекрестка</p>
//         <button className="ui basic negative fluid button" onClick={this.handleAddNodeCancel}>
//           Отмена
//         </button>
//       </div>
//     );
//   };
//
//   renderSelectNode = () => {
//     if (this.state.selected) {
//       const node = this.state.selected;
//
//       const values = {
//         id: node.id,
//         hasLight: !!node.light,
//         redPhase: node.light ? node.light.redPhase : 15,
//         greenPhase: node.light ? node.light.greenPhase : 15
//       };
//
//       const onReset = () => {
//         this.setState({
//           activeView: '',
//           selected: null
//         });
//       };
//
//       const onSave = ({ id, hasLight, redPhase, greenPhase }) => {
//         onReset();
//
//         this.props.nodes.update({
//           id,
//           label: hasLight ? `${redPhase} ${greenPhase}` : '',
//           shape: hasLight ? 'circularImage' : 'dot',
//           image: '../images/traffic-light.png',
//           light: hasLight ? { redPhase, greenPhase } : null
//         });
//       };
//
//       const onDelete = () => {
//         this.setState({
//           activeView: '',
//           selected: null
//         });
//
//         const connectedEdges = this.props.network.getConnectedEdges(values.id);
//
//         connectedEdges.forEach(edgeId => {
//           const edge = this.props.edges.get(edgeId);
//
//           const [from, to] = this.props.nodes.get([edge.from, edge.to]);
//
//           if (from.id !== values.id) {
//             from.value -= edge.value;
//             this.props.nodes.update(from);
//           } else if (to.id !== values.id) {
//             to.value -= edge.value;
//             this.props.nodes.update(to);
//           }
//
//           this.props.edges.remove(edge);
//         });
//
//         this.props.nodes.remove(node);
//       };
//
//       return <RouteNodeEditView initialValues={values}
//                                 onSave={onSave}
//                                 onReset={onReset}
//                                 onDelete={onDelete}/>;
//     }
//
//     return null;
//   };
//
//   renderAddEdge = () => {
//     return (
//       <div className="ui fluid">
//         <p>Соедините два перекрестка</p>
//         <button className="ui basic negative fluid button" onClick={this.handleAddEdgeCancel}>
//           Отмена
//         </button>
//       </div>
//     );
//   };
//
//   renderSelectEdge = () => {
//     if (this.state.selected) {
//       const edge = this.state.selected;
//
//       const values = {
//         id: edge.id,
//         length: 50
//       };
//
//       return <RouteEdgeEditView initialValues={values} onSave={values => console.log('vals', values)}/>;
//     }
//   };
//
//   renderDefaultNodeView = () => (
//     <div className="ui vertical basic fluid labeled icon buttons">
//       <button className="ui button" onClick={this.handleAddNodeClick}>
//         <i className="sitemap icon"/> Добавить перекресток
//       </button>
//       <button className="ui button" onClick={this.handleAddEdgeClick}>
//         <i className="road icon"/> Добавить участок
//       </button>
//     </div>
//   );
//
//
//   render() {
//     let nodeView = null;
//
//     switch (this.state.activeView) {
//       case "addNode":
//         nodeView = this.renderAddNode();
//         break;
//
//       case "selectNode":
//         nodeView = this.renderSelectNode();
//         break;
//
//       case "addEdge":
//         nodeView = this.renderAddEdge();
//         break;
//
//       case "selectEdge":
//         nodeView = this.renderSelectEdge();
//         break;
//
//       default:
//         nodeView = this.renderDefaultNodeView();
//         break;
//     }
//
//
//     return (
//       <Accordion className="styled">
//         <div className="title">
//           <i className="options icon"/> Редактировать
//         </div>
//         <div className="content">
//           {nodeView}
//         </div>
//         <div className="title">
//           <i className="fork icon"/> Оптимальный маршрут
//         </div>
//         <div className="content">
//           <div className="ui vertical basic fluid buttons">
//             <button className="ui button">
//               <i className="sitemap icon"/> Добавить перекресток
//             </button>
//             <button className="ui button">
//               <i className="road icon"/> Добавить участок дорогиdfs
//             </button>
//           </div>
//         </div>
//         <div className="title">
//           <i className="settings icon"/> Настройки
//         </div>
//         <div className="content">
//           <div className="ui vertical basic fluid buttons">
//             <button className="ui button">
//               <i className="sitemap icon"/> Добавить перекресток
//             </button>
//             <button className="ui button">
//               <i className="road icon"/> Добавить участок дорогиdfs
//             </button>
//           </div>
//         </div>
//       </Accordion>
//     );
//   }
// }
//
// RouteToolbar.propTypes = {};
