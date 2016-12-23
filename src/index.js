import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';

require('./favicon.ico'); // Tell webpack to load favicon.ico
require('./images/traffic-light.png');

import 'jquery/dist/jquery';
import 'react-select/dist/react-select.css';
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/semantic';
import 'semantic-ui-css/components/dropdown';
import 'vis/dist/vis-network.min.css';
import './styles/styles.scss';


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes(store)} />
  </Provider>, document.getElementById('app')
);
