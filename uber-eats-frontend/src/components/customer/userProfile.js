/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import Axios from 'axios';
import { Image } from 'cloudinary-react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CountryDropdown } from 'react-country-region-selector';
import { toast } from 'react-toastify';
import NavBar from '../../NavBar';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

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

class userProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      add1: '',
      add2: '',
      location: '',
      state: '',
      country: '',
      nickname: '',
      dob: '',
      about: '',
      email: '',
      contact: '',
      picture: '',
      preview: '',
      uploadPublicID: '',
      authMessage: true,
      authMessageE: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/userProfile')
      .then((res) => {
        if (res) {
          this.setState({ name: res.data.name });
          this.setState({ add1: res.data.add1 });
          this.setState({ add2: res.data.add2 });
          this.setState({ location: res.data.location });
          this.setState({ state: res.data.state });
          this.setState({ country: res.data.country });
          this.setState({ nickname: res.data.nickname });
          this.setState({ dob: res.data.dob });
          this.setState({ about: res.data.about });
          this.setState({ email: res.data.email });
          this.setState({ contact: res.data.contact });
          this.setState({ picture: res.data.picture });
          this.setState({ preview: res.data.preview });
          this.setState({ uploadPublicID: res.data.uploadPublicID });
        }
      }).catch((err) => {
        console.log(`User Profile: ${err}`);
      });
  }

    handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    }

    handleFileChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
      const file = e.target.files[0];
      console.log(file);
      console.log(e.target.value);
      this.previewFile(file);
    }

    handleValidation() {
    // console.log('validation');
      const {
        authMessage,
      } = this.state;
      const authMessageE = authMessage ? 'Profile Updated' : 'Error Updating Profile';
      this.setState({
        authMessageE,
      });
    }

    notify = () => {
      toast.success('Profile Updated!');
    };

    previewFile = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.setState({ preview: reader.result });
      };
    }

    updateProfile = (data) => {
      Axios.defaults.withCredentials = true;
      Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      Axios.post('http://localhost:3001/updateProfile', data)
        .then((res) => {
          if (res) {
            console.log('Updated');
            this.setState({
              authMessage: true,
            });
            this.props.dispatch({
              type: 'USER_PROFILE_UPDATED',
              payload: true,
            });
          }
        }).catch((err) => {
          console.log(`User Update Profile: ${err}`);
          this.setState({
            authMessage: false,
          });
        });
      this.handleValidation();
    }

    updateUser = (e) => {
      e.preventDefault();
      const userData = {
        name: this.state.name,
        add1: this.state.add1,
        add2: this.state.add2,
        location: this.state.location,
        state: this.state.state,
        country: this.state.country,
        nickname: this.state.nickname,
        dob: this.state.dob,
        about: this.state.about,
        email: this.state.email,
        contact: this.state.contact,
        picture: this.state.picture,
        preview: this.state.preview,
      };
      this.updateProfile(userData);
    }

    selectCountry(val) {
      this.setState({ country: val });
    }

    render() {
      let redirectVar = null;
      let UpdateToast = null;
      if (!cookie.load('cookie')) {
        redirectVar = <Redirect to="/login" />;
      }
      if (this.props.userProfileUpdate) {
        UpdateToast = this.notify();
      }
      const authMessageE = this.state.authMessageE;
      const { country } = this.state;
      return (
        <div>
          <NavBar />
          {redirectVar}
          {UpdateToast}
          <div className="container">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <HeadText>
                    User&apos;s Profile
                    <br />
                    <br />
                  </HeadText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Name
                    <br />
                    <input type="text" name="name" defaultValue={this.state.name} placeholder=" Name " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Address
                    <br />
                    <input type="text" name="add1" defaultValue={this.state.add1} placeholder=" Address " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Alternate Address
                    <br />
                    <input type="text" name="add2" defaultValue={this.state.add2} placeholder=" Address " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    City
                    <br />
                    <input type="text" name="location" defaultValue={this.state.location} placeholder=" City " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    State
                    <br />
                    <input type="text" name="state" defaultValue={this.state.state} placeholder=" State " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Country
                    <br />
                    <CountryDropdown value={country} defaultValue={this.state.country} placeholder=" Country " style={{ width: '390px', height: '35px' }} onChange={(val) => this.selectCountry(val)} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    NickName
                    <br />
                    <input type="text" name="nickname" defaultValue={this.state.nickname} placeholder=" NickName " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Date of Birth
                    <br />
                    <input type="date" name="dob" defaultValue={this.state.dob} placeholder=" DOB " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Email
                    <br />
                    <input type="email" name="email" defaultValue={this.state.email} placeholder=" Email " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    About
                    <br />
                    <input type="text" name="about" defaultValue={this.state.about} placeholder=" About " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Contact
                    <br />
                    <input type="tel" name="contact" defaultValue={this.state.contact} placeholder=" Contact " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                    <span style={{ color: 'green' }}>
                      {authMessageE}
                    </span>
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Profile Image
                    <br />
                    <input type="file" name="picture" defaultValue={this.state.picture} onChange={this.handleFileChange} required />
                    <br />
                    {this.state.preview && (<img src={this.state.preview} alt="chosen" style={{ height: '200px' }} />)}
                    <Image
                      cloudName="sushanubereats"
                      publicID={this.state.uploadPublicID}
                      width="150"
                      crop="scale"
                    />
                    <br />
                  </OverallText>
                </div>
              </div>
              <button type="submit" onClick={this.updateUser} style={{ width: '390px', height: '35px', backgroundColor: '#7bb420' }}>Update Profile</button>
            </form>
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return { userProfileUpdate: state.userProfileUpdate };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(userProfile);
