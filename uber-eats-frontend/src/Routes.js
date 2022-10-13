import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import history from './history';
import NavBar from './NavBar';
import UserLogin from './components/customer/index';
import userReg from './components/customer/userReg';
import resLogin from './components/restaurant/index';
import resReg from './components/restaurant/resReg';
import resHome from './components/restaurant/resHome';
import resProfile from './components/restaurant/resProfile';
import userProfile from './components/customer/userProfile';
import resAddItems from './components/restaurant/resAddItems';
import addMenu from './components/restaurant/addMenu';
import homePage from './components/customer/homepage';
import seeRestaurant from './components/customer/seeRestaurant';
import addToCart from './components/customer/addToCart';
import userorder from './components/customer/userorder';
import resorder from './components/restaurant/resorder';
import resEditMenu from './components/restaurant/resEditMenu';
import userFavourites from './components/customer/userFavourites';
import checkout from './components/customer/checkout';
import rorderdeets from './components/restaurant/rorderdeets';
import uorderdeets from './components/customer/uorderdeets';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={NavBar} />
          <Route path="/login" exact component={UserLogin} />
          <Route path="/userReg" exact component={userReg} />
          <Route path="/reslogin" exact component={resLogin} />
          <Route path="/resReg" exact component={resReg} />
          <Route path="/resHome" exact component={resHome} />
          <Route path="/resProfile" exact component={resProfile} />
          <Route path="/userprofile" exact component={userProfile} />
          <Route path="/resadditems" exact component={resAddItems} />
          <Route path="/addmenu" exact component={addMenu} />
          <Route path="/homepage" exact component={homePage} />
          <Route path="/seerestaurant" exact component={seeRestaurant} />
          <Route path="/cart" exact component={addToCart} />
          <Route path="/order" exact component={userorder} />
          <Route path="/resorders" exact component={resorder} />
          <Route path="/editmenu" exact component={resEditMenu} />
          <Route path="/favourites" exact component={userFavourites} />
          <Route path="/checkout" exact component={checkout} />
          <Route path="/rorderdeets" exact component={rorderdeets} />
          <Route path="/uorderdeets" exact component={uorderdeets} />
        </Switch>
      </Router>
    );
  }
}
