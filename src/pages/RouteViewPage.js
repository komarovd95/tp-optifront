import React from 'react';
import Animation from '../commons/Animation';
import { RouteToolbarContainer, RouteViewContainer } from '../routes/view';


export default class RouteViewPage extends React.Component {
  render() {
    return (
      <Animation>
        {/*<div className="route-view">*/}
          {/*<div className="route-toolbar">*/}
            {/*<RouteToolbarContainer/>*/}
          {/*</div>*/}
          {/*<div className="route-container">*/}
            {/*<RouteViewContainer/>*/}
          {/*</div>*/}
        {/*</div>*/}
        <RouteViewContainer/>
      </Animation>
    );
  }
}
