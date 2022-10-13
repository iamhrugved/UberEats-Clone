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

class resProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      location: '',
      description: '',
      contact: '',
      dishes: '',
      timing: '',
      delivery: '',
      pickup: '',
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
    Axios.get('http://localhost:3001/resProfile')
      .then((res) => {
        if (res) {
          this.setState({ name: res.data.name });
          this.setState({ location: res.data.location });
          this.setState({ description: res.data.description });
          this.setState({ contact: res.data.contact });
          this.setState({ picture: res.data.picture });
          this.setState({ dishes: res.data.dishes });
          this.setState({ timing: res.data.timings });
          this.setState({ delivery: res.data.delivery });
          this.setState({ pickup: res.data.pickup });
          this.setState({ picture: res.data.picture });
          this.setState({ preview: res.data.preview });
          this.setState({ uploadPublicID: res.data.uploadPublicID });
        }
      }).catch((err) => {
        console.log(`Restaurant Profile: ${err}`);
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
      Axios.post('http://localhost:3001/resupdateProfile', data)
        .then((res) => {
          if (res) {
            console.log('Updated');
            this.setState({
              authMessage: true,
            });
            this.props.dispatch({
              type: 'RESTAURANT_PROFILE_UPDATED',
              payload: true,
            });
          }
        }).catch((err) => {
          console.log(`Restaurant Update Profile: ${err}`);
          this.setState({
            authMessage: false,
          });
        });
      this.handleValidation();
    }

    updateRes = (e) => {
      e.preventDefault();
      const ownerData = {
        name: this.state.name,
        location: this.state.location,
        description: this.state.description,
        contact: this.state.contact,
        dishes: this.state.dishes,
        timing: this.state.timing,
        delivery: this.state.delivery,
        pickup: this.state.pickup,
        picture: this.state.picture,
        preview: this.state.preview,
      };
      this.updateProfile(ownerData);
    }

    render() {
      let redirectVar = null;
      let UpdateToast = null;
      if (!cookie.load('cookie')) {
        redirectVar = <Redirect to="/reslogin" />;
      }
      if (this.props.restProfileUpdate) {
        UpdateToast = this.notify();
      }
      const authMessageE = this.state.authMessageE;
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
                    Restaurant&apos;s Profile
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
                    <input type="text" name="name" defaultValue={this.state.name} placeholder=" Restaurant Name " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Location
                    <br />
                    <input type="text" name="location" defaultValue={this.state.location} placeholder=" Restaurant Location " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Description
                    <br />
                    <input type="text" name="description" defaultValue={this.state.description} placeholder=" Restaurant Description " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
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
                    <input type="tel" name="contact" defaultValue={this.state.contact} placeholder=" Restaurant Contact " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Timings
                    <br />
                    <input type="text" name="timing" defaultValue={this.state.timing} placeholder=" Restaurant Timing " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Delivery
                    <br />
                    <input type="text" name="delivery" defaultValue={this.state.delivery} placeholder=" Delivery " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Pickup
                    <br />
                    <input type="text" name="pickup" defaultValue={this.state.pickup} placeholder=" Pickup " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
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
                    <span style={{ color: 'green' }}>
                      {authMessageE}
                    </span>
                  </OverallText>
                </div>
              </div>
              <button type="submit" onClick={this.updateRes} style={{ width: '390px', height: '35px', backgroundColor: '#7bb420' }}>Update Profile</button>
            </form>
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return { restProfileUpdate: state.restProfileUpdate };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(resProfile);
