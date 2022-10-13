/* eslint-disable dot-notation */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
// import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Axios from 'axios';
import { Image } from 'cloudinary-react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import styled from 'styled-components';
// eslint-disable-next-line import/no-cycle
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

class addMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      p_name: '',
      p_ingredients: '',
      p_description: '',
      p_category: '',
      p_type: '',
      p_price: 0,
      picture: '',
      preview: '',
      uploadPublicID: '',
      redirect: '',
      nameValid: '',
      ingredientsValid: '',
      descriptionValid: '',
      categoryValid: '',
      typeValid: '',
      priceValid: '',
      nameError: '',
      ingredientsError: '',
      descriptionError: '',
      categoryError: '',
      typeError: '',
      priceError: '',
    };
    this.nameInputHandler = this.nameInputHandler.bind(this);
    this.ingredientsInputHandler = this.ingredientsInputHandler.bind(this);
    this.descriptionInputHandler = this.descriptionInputHandler.bind(this);
    this.categoryInputHandler = this.categoryInputHandler.bind(this);
    this.typeInputHandler = this.typeInputHandler.bind(this);
    this.priceInputHandler = this.priceInputHandler.bind(this);
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
      nameValid,
      ingredientsValid,
      descriptionValid,
      categoryValid,
      typeValid,
      priceValid,
    } = this.state;
    const nameError = nameValid ? '' : 'Dish cannot be empty.';
    const ingredientsError = ingredientsValid ? '' : 'Ingredients cannot be empty.';
    const descriptionError = descriptionValid ? '' : 'Description cannot be empty.';
    const categoryError = categoryValid ? '' : 'Category cannot be blank.';
    const typeError = typeValid ? '' : 'Type cannot be blank.';
    const priceError = priceValid ? '' : 'Price cannot be 0.';
    this.setState({
      nameError,
      ingredientsError,
      descriptionError,
      categoryError,
      typeError,
      priceError,
    });
  }

  nameInputHandler = (event) => {
    console.log(event.target.value);
    const p_name = event.target.value;
    if (p_name !== '') {
      this.setState({
        p_name,
        nameValid: true,
      });
    } else {
      this.setState({
        nameValid: false,
      });
    }
  }

  ingredientsInputHandler = (event) => {
    console.log(event.target.value);
    const p_ingredients = event.target.value;
    if (p_ingredients !== '') {
      this.setState({
        p_ingredients,
        ingredientsValid: true,
      });
    } else {
      this.setState({
        ingredientsValid: false,
      });
    }
  }

  descriptionInputHandler = (event) => {
    console.log(event.target.value);
    const p_description = event.target.value;
    if (p_description !== '') {
      this.setState({
        p_description,
        descriptionValid: true,
      });
    } else {
      this.setState({
        descriptionValid: false,
      });
    }
  }

  categoryInputHandler = (event) => {
    console.log(event.target.value);
    const p_category = event.target.value;
    if (p_category !== '') {
      this.setState({
        p_category,
        categoryValid: true,
      });
    } else {
      this.setState({
        categoryValid: false,
      });
    }
  }

  typeInputHandler = (event) => {
    console.log(event.target.value);
    const p_type = event.target.value;
    if (p_type !== '') {
      this.setState({
        p_type,
        typeValid: true,
      });
    } else {
      this.setState({
        typeValid: false,
      });
    }
  }

  priceInputHandler = (event) => {
    console.log(event.target.value);
    const p_price = event.target.value;
    if (p_price !== '') {
      this.setState({
        p_price,
        priceValid: true,
      });
    } else {
      this.setState({
        priceValid: false,
      });
    }
  }

  handleFileChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    const file = e.target.files[0];
    console.log(file);
    console.log(e.target.value);
    this.previewFile(file);
  }

  notify = () => {
    toast.success('Item Added/Updated!');
  };

  previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({ preview: reader.result });
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      p_name,
      p_ingredients,
      p_description,
      p_category,
      p_type,
      p_price,
      preview,
    } = this.state;
    console.log(p_name, p_ingredients, p_description, p_category, p_type, p_price);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/addMenu', {
      p_name,
      p_ingredients,
      p_description,
      p_category,
      p_type,
      p_price,
      preview,
    }).then((response) => {
      console.log('Status Code : ', response.status);
      console.log(response);
      const status = response.data.status;
      if (status === 1062) {
        this.setState({
          redirect: false,
        });
      } else {
        this.setState({
          redirect: true,
        });
        this.props.dispatch({
          type: 'RESTAURANT_MENU_ADD',
          payload: true,
        });
      }

      // props.history.push('/login');
      // <Redirect to='/login'/>
    }); this.handleValidation();
  }

  render() {
    let redirectVar = null;
    let UpdateToast = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to="/resadditems" />;
    }
    if (this.props.restaddMenu) {
      UpdateToast = this.notify();
    }
    const nameError = this.state.nameError;
    const ingredientsError = this.state.ingredientsError;
    const descriptionError = this.state.descriptionError;
    const categoryError = this.state.categoryError;
    const typeError = this.state.typeError;
    const priceError = this.state.priceError;
    return (
      <div>
        {redirectVar}
        {UpdateToast}
        <NavBar />
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <HeadText>
                  Let&apos;s add Item to your Menu.
                  <br />
                  <br />
                </HeadText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Enter Menu Details.
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Dish Name
                  <br />
                  <input type="text" name="p_user" placeholder=" Dish Name " style={{ width: '390px', height: '35px' }} onChange={this.nameInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {nameError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Dish Ingredients
                  <br />
                  <input type="text" name="p_ingredients" placeholder=" Dish Ingredients " style={{ width: '390px', height: '35px' }} onChange={this.ingredientsInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {ingredientsError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Dish Description
                  <br />
                  <input type="text" name="p_description" placeholder=" Dish Description " style={{ width: '390px', height: '35px' }} onChange={this.descriptionInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {descriptionError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Dish Category
                  <br />
                  <input type="text" name="p_category" placeholder=" Dish Category " style={{ width: '390px', height: '35px' }} onChange={this.categoryInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {categoryError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Type(Veg/NonVeg)
                  <br />
                  <input type="text" name="p_type" placeholder=" Dish Type " style={{ width: '390px', height: '35px' }} onChange={this.typeInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {typeError}
                  </span>
                  <br />
                </OverallText>
              </div>
            </div>
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  Dish Price
                  <br />
                  <input type="text" name="p_price" placeholder=" Dish Price " style={{ width: '390px', height: '35px' }} onChange={this.priceInputHandler} required />
                  <span style={{ color: 'red' }}>
                    {priceError}
                  </span>
                  <br />
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
            <div className="row">
              <div className="col-xs" />
              <div className="col-xs">
                <OverallText>
                  <input type="button" value="Add Item" style={{ width: '390px', height: '35px', backgroundColor: '#7bb420' }} onClick={this.handleSubmit} />
                </OverallText>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { restaddMenu: state.restaddMenu };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(addMenu);
