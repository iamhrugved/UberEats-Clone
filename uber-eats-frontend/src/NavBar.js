// /* eslint-disable */
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
// import { Redirect } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
// import { Glyphicon } from 'react-bootstrap';
// import Button from '@material-ui/core/Button';
import {
  Navbar,
  NavDropdown,
  Form,
  Button,
} from 'react-bootstrap';
// import Icon from '@mui/material/Icon';
// import RestaurantIcon from '@mui/icons-material/Restaurant';

// create the Navbar Component
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  // handle logout to destroy the cookie

    handleLogout = () => {
      localStorage.removeItem('ubereatsResToken');
      localStorage.removeItem('token');
      cookie.remove('cookie', { path: '/' });
    }

    handleUserLogout = () => {
      localStorage.removeItem('ubereatsUserToken');
      localStorage.removeItem('token');
      cookie.remove('cookie', { path: '/' });
    }

    render() {
      let navBarButtons = null;
      const buttonStyle = {
        margin: '6px',
      };

      if (localStorage.getItem('ubereatsResToken')) {
        console.log('Restaurant Active sesh!');
        navBarButtons = (
          <Form className="offset-sm-9" inline>
            {/* <Button variant="link" style={btnStyle} href='/reshome'>Home</Button> */}
            <NavDropdown title="Restaurant Account" id="nav-dropdown">
              <NavDropdown.Item href="/reshome">Home</NavDropdown.Item>
              <NavDropdown.Item href="/resprofile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="/resadditems">Add Menu Item</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.handleLogout} href="/">Logout</NavDropdown.Item>
            </NavDropdown>
          </Form>
        );
      } else if (localStorage.getItem('ubereatsUserToken')) {
        console.log('User Active Sesh!');
        navBarButtons = (
          <Form className="offset-sm-9" inline>
            <Button variant="link" style={buttonStyle} href="/cart">Cart</Button>
            <NavDropdown title="Account" id="nav-dropdown">
              <NavDropdown.Item href="/homepage">Home</NavDropdown.Item>
              <NavDropdown.Item href="/order">Order</NavDropdown.Item>
              <NavDropdown.Item href="/favourites">Favourites</NavDropdown.Item>
              <NavDropdown.Item href="/userprofile">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.handleUserLogout} href="/login">Logout</NavDropdown.Item>
            </NavDropdown>
          </Form>
        );
      } else {
        console.log('No Active sesh!');
        navBarButtons = (
          <Form className="offset-sm-9" inline>
            <Button variant="success" style={buttonStyle} href="/login">Login</Button>
            <Button variant="outline-success" style={buttonStyle} href="/userReg">Sign Up</Button>
            <Button variant="primary" style={buttonStyle} href="/reslogin">Business?</Button>
          </Form>
        );
      }
      return (
        <div>
          <Navbar bg="transparent" expand="lg">
            {navBarButtons}
          </Navbar>
        </div>
      );
    }
}
export default NavBar;
