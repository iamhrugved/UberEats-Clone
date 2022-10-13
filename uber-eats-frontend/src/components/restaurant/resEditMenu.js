/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Axios from 'axios';
import { Image } from 'cloudinary-react';
import { connect } from 'react-redux';
import styled from 'styled-components';
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

class resEditMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      p_name: '',
      p_ingredients: '',
      p_description: '',
      p_category: '',
      p_type: '',
      p_price: '',
      picture: '',
      preview: '',
      uploadPublicID: '',
      authMessage: true,
      authMessageE: '',
      redirect: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    Axios.defaults.withCredentials = true;
    Axios.get('http://localhost:3001/resEditMenu')
      .then((res) => {
        if (res) {
          this.setState({ p_name: res.data[0].p_name });
          this.setState({ p_ingredients: res.data[0].p_ingredients });
          this.setState({ p_description: res.data[0].p_description });
          this.setState({ p_category: res.data[0].p_category });
          this.setState({ p_type: res.data[0].p_type });
          this.setState({ p_price: res.data[0].p_price });
          this.setState({ picture: res.data[0].picture });
          this.setState({ preview: res.data[0].preview });
          this.setState({ uploadPublicID: res.data[0].uploadPublicID });
        }
      }).catch((err) => {
        console.log(`Restaurant Menu Edit: ${err}`);
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
      const authMessageE = authMessage ? 'Menu Updated' : 'Error Updating Menu';
      this.setState({
        authMessageE,
      });
    }

    previewFile = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.setState({ preview: reader.result });
      };
    }

    updateMenuItem = (data) => {
      Axios.post('http://localhost:3001/resupdateMenu', data)
        .then((res) => {
          if (res) {
            console.log('Updated');
            this.setState({
              authMessage: true,
              redirect: true,
            });
            this.props.dispatch({
              type: 'RESTAURANT_MENU_UPDATED',
              payload: true,
            });
          }
        }).catch((err) => {
          console.log(`Restaurant Update Menu: ${err}`);
          this.setState({
            authMessage: false,
          });
        });
      this.handleValidation();
    }

    updateMenu = (e) => {
      e.preventDefault();
      const ownerData = {
        p_name: this.state.p_name,
        p_ingredients: this.state.p_ingredients,
        p_description: this.state.p_description,
        p_category: this.state.p_category,
        p_type: this.state.p_type,
        p_price: this.state.p_price,
        picture: this.state.picture,
        preview: this.state.preview,
      };
      this.updateMenuItem(ownerData);
    }

    render() {
      let redirectVar = null;
      if (this.state.redirect) {
        redirectVar = <Redirect to="/resadditems" />;
      }
      const authMessageE = this.state.authMessageE;
      return (
        <div>
          <NavBar />
          {redirectVar}
          <div className="container">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <HeadText>
                    Restaurant&apos;s Menu
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
                    <input type="text" name="p_name" defaultValue={this.state.p_name} placeholder=" Item Name " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Ingredients
                    <br />
                    <input type="text" name="p_ingredients" defaultValue={this.state.p_ingredients} placeholder=" Ingredients " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
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
                    <input type="text" name="p_description" defaultValue={this.state.p_description} placeholder=" Dish Description " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Category
                    <br />
                    <input type="tel" name="p_category" defaultValue={this.state.p_category} placeholder=" Category " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Type
                    <br />
                    <input type="text" name="p_type" defaultValue={this.state.p_type} placeholder=" Veg/NonVeg " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                    <br />
                  </OverallText>
                </div>
              </div>
              <div className="row">
                <div className="col-xs" />
                <div className="col-xs">
                  <OverallText>
                    Price
                    <br />
                    <input type="text" name="p_price" defaultValue={this.state.p_price} placeholder=" Price " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
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
                    Dish Image
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
              <button type="submit" onClick={this.updateMenu} style={{ width: '390px', height: '35px', backgroundColor: '#7bb420' }}>Update Menu</button>
            </form>
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return { restMenuUpdated: state.restMenuUpdated };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(resEditMenu);
