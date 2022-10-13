/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
// import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Axios from 'axios';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import styled from 'styled-components';
import history from './history';
// eslint-disable-next-line import/no-cycle
import resLogin from './index';
import NavBar from '../../NavBar';

const HeadText = styled.h2`
    font-size: 30px;
    font-weight: 500;
    line-height: 1.24;
    color: ##000000;
    float: left;
    // z-index: 0;
    // margin: 0;
    //padding-left: 150px;
`;
const OverallText = styled.h2`
    font-size: 18px;
    font-weight: 300;
    line-height: 1.00;
    color: ##000000;
    float: left;
    // z-index: 0;
    // margin: 0;
    //padding-left: 150px;
`;

class resReg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      location: '',
      email: '',
      password: '',
      // register: false,
      // redirect: null,
      usernameValid: '',
      locationValid: '',
      emailValid: '',
      passwordValid: '',
      emailDup: '',
      usernameError: '',
      locationError: '',
      emailError: '',
      passwordError: '',
      emailDupError: '',
    };
    this.usernameInputHandler = this.usernameInputHandler.bind(this);
    this.locationInputHandler = this.locationInputHandler.bind(this);
    this.emailInputHandler = this.emailInputHandler.bind(this);
    this.passwordInputHandler = this.passwordInputHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() {
  //   this.setState({
  //     // eslint-disable-next-line react/no-unused-state
  //     register: false,
  //   });
  // }

  handleValidation() {
    // console.log('validation');
    const {
      usernameValid,
      locationValid,
      emailValid,
      passwordValid,
      emailDup,
    } = this.state;
    const usernameError = usernameValid ? '' : 'Name cannot be empty.';
    const locationError = locationValid ? '' : 'Location cannot be empty.';
    const emailError = emailValid ? '' : 'Email is invalid';
    const passwordError = passwordValid ? '' : 'Password cannot be blank.';
    const emailDupError = emailDup ? '' : 'Email already exists.';
    this.setState({
      usernameError,
      locationError,
      emailError,
      passwordError,
      emailDupError,
    });
  }

  usernameInputHandler = (event) => {
    console.log(event.target.value);
    const username = event.target.value;
    if (username !== '') {
      this.setState({
        username,
        usernameValid: true,
      });
    } else {
      this.setState({
        usernameValid: false,
      });
    }
  }

  emailInputHandler = (event) => {
    console.log(event.target.value);
    const email = event.target.value;
    const emailRegExp = new RegExp('.+@.+\\..+');
    if (email !== '' && emailRegExp.test(email)) {
      this.setState({
        email,
        emailValid: true,
      });
    } else {
      this.setState({
        emailValid: false,
      });
    }
  }

  passwordInputHandler = (event) => {
    console.log(event.target.value);
    const password = event.target.value;
    if (password !== '') {
      this.setState({
        password,
        passwordValid: true,
      });
    } else {
      this.setState({
        passwordValid: false,
      });
    }
  }

  locationInputHandler = (event) => {
    console.log(event.target.value);
    const location = event.target.value;
    if (location !== '') {
      this.setState({
        location,
        locationValid: true,
      });
    } else {
      this.setState({
        locationValid: false,
      });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      username,
      location,
      email,
      password,
    } = this.state;
    console.log(username, location, email, password);
    Axios.post('http://localhost:3001/resReg', {
      username,
      location,
      email,
      password,
    }).then((response) => {
      console.log('Status Code : ', response.status);
      console.log(response);
      const status = response.data.status;
      if (status === 1062) {
        this.setState({
          // redirect: false,
          emailDup: true,
        });
      } else {
        this.setState({
          // redirect: true,
          emailDup: false,
        });
        this.props.dispatch({
          type: 'RESTAURANT_REGISTERED',
          payload: true,
        });
      }

      // props.history.push('/login');
      // <Redirect to='/login'/>
    }); this.handleValidation();
  }

  render() {
    let redirectVar = null;
    if (this.props.redirectRestReg) {
      redirectVar = <Redirect to="/reslogin" />;
    }
    const usernameError = this.state.usernameError;
    const locationError = this.state.locationError;
    const emailError = this.state.emailError;
    const passwordError = this.state.passwordError;
    const emailDupError = this.state.emailDupError;
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <HeadText>
                  Let&apos;s register your business
                  <br />
                  <br />
                </HeadText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Enter details.
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  <input type="text" name="username" placeholder=" Restaurant Name " style={{ width: '390px', height: '35px' }} onChange={this.usernameInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {usernameError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  <input type="email" name="email" placeholder=" Email " style={{ width: '390px', height: '35px' }} onChange={this.emailInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {emailError}
                  </span>
                  <span style={{ color: 'red' }}>
                    {emailDupError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  <input type="password" name="password" placeholder=" Password " style={{ width: '390px', height: '35px' }} onChange={this.passwordInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {passwordError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  <input type="text" name="location" placeholder=" Restaurant Location " style={{ width: '390px', height: '35px' }} onChange={this.locationInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {locationError}
                  </span>
                  <br />
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  <input type="button" value="Register" style={{ width: '390px', height: '35px', backgroundColor: '#7bb420' }} onClick={this.handleSubmit} />
                </OverallText>
              </div>
            </div>
          </form>
          <div className="row">
            <div className="col-xs" />
            <div className="col-xs">
              <OverallText>
                Already a partner?
                <Router forceRefresh>
                  <Link to="/reslogin" onClick={() => history.push('/reslogin')} style={{ color: 'green' }}> Login</Link>
                  <Switch>
                    <Route exact path="/reslogin" component={resLogin} />
                  </Switch>
                </Router>
              </OverallText>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { redirectRestReg: state.redirectRestReg };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(resReg);
