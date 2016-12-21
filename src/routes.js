import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import { SecuredComponent } from './users/auth';


import App from './app';
import SignIn from './users/signin';
import SignUp from './users/signup';
import LandingPage from './pages/LandingPage';
import Profile from './profile';
import ProfileInfo from './users/profile';
import ProfileEdit from './users/edit';
import CarsList from './cars/list';
import CarEdit from './cars/edit';
import BrandsList from './brands/list';
import BrandEdit from './brands/edit';
import CoverTypesList from './coverTypes/list';
import CoverTypeEdit from './coverTypes/edit';
import FuelTypesList from './fuelTypes/list';
import FuelTypeEdit from './fuelTypes/edit';
import RoutesList from './routes/list';
import StreetsList from './streets/list';
import StreetEdit from './streets/edit';
import UsersList from './users/list';
import ForbiddenPage from './pages/401';
import NotFoundPage from './pages/404';

import { RouteViewContainer } from './routes/view';


export default (
    <Route path="/" component={App}>
      <IndexRoute component={LandingPage}/>
      <Route path="signin" component={SignIn}/>
      <Route path="signup" component={SignUp}/>
      <Route path="id:userId" component={Profile}>
        <IndexRoute component={ProfileInfo}/>
        <Route path="edit" component={ProfileEdit}/>
        <Route path="routes" component={RoutesList}/>
        <Route path="cars" component={CarsList}/>
      </Route>
      <Route path="admin" component={SecuredComponent(Profile, s => u => !u.isAdmin())}>
        <Route path="users" component={UsersList}/>
        <Route path="routes" component={RoutesList}/>
        <Route path="cars">
          <IndexRoute component={CarsList}/>
          <Route path="id:carId" component={CarEdit}/>
          <Route path="new" component={CarEdit}/>
        </Route>
        <Route path="brands">
          <IndexRoute component={BrandsList}/>
          <Route path="id:brandId" component={BrandEdit}/>
          <Route path="new" component={BrandEdit}/>
        </Route>
        <Route path="fuelTypes">
          <IndexRoute component={FuelTypesList}/>
          <Route path="id:fuelTypeId" component={FuelTypeEdit}/>
          <Route path="new" component={FuelTypeEdit}/>
        </Route>
        <Route path="coverTypes">
          <IndexRoute component={CoverTypesList}/>
          <Route path="id:coverTypeId" component={CoverTypeEdit}/>
          <Route path="new" component={CoverTypeEdit}/>
        </Route>
        <Route path="streets">
          <IndexRoute component={StreetsList}/>
          <Route path="id:streetId" component={StreetEdit}/>
          <Route path="new" component={StreetEdit}/>
        </Route>
      </Route>
      <Route path="routes">
        <Route path="id:routeId" component={RouteViewContainer}/>
        <Route path="new" component={RouteViewContainer}/>
        <Route path="example" component={RouteViewContainer}/>
      </Route>
      <Route path="401" component={ForbiddenPage}/>
      <Route path="404" component={NotFoundPage}/>
      <Redirect from="*" to="404"/>
    </Route>
);
