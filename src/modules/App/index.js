import React, { Component } from 'react';
import {
  Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import { connect } from 'unistore/react';
import history from '~/history';

import Actions, { /*loadDataAPI,*/ loadData } from '~/state/Actions';
import AppWrapper from './AppWrapper';
import Store from '~/state/Store';

// const loadDataAPIAction = Store.action(loadDataAPI(Store));
// loadDataAPIAction();

const loadDataAction = Store.action(loadData(Store));
loadDataAction();

const NotFoundRoute = () => (
  <Redirect to="/" />
);

class App extends Component {

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path={['/', '/suche', '/analyse', '/liste', '/favoriten', '/info']} component={AppWrapper} />
          <Route component={NotFoundRoute} />
        </Switch>
      </Router>
    )
  }
}

export default connect(
  state => state,
  Actions
)(App);
