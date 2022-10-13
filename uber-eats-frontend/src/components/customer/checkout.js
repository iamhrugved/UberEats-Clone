/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-else-return */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable dot-notation */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import NavBar from '../../NavBar';

const HeadText = styled.h2`
    font-size: 20px;
    font-weight: 350;
    line-height: 1.05;
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

class checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      //   users: [],
      po_id: 0,
      redirect: false,
      totalprice: 0,
      SplInv: [],
      name: '',
      contact: '',
      email: '',
      add1: '',
      add2: '',
      currentDateTime: Date().toLocaleString(),
      isOpen: false,
    //   finalorder: 0,
    };
  }

  componentDidMount() {
    const menuList = [];
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/getCart')
      .then((res) => {
        if (res) {
          console.log(res.data);
          if (res.data.length >= 0) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < res.data.length; i++) {
              menuList.push(res.data[i]);
            }
          }
          this.setState({ products: menuList });
          this.props.dispatch({
            type: 'USER_CHECKOUT_VISIT',
            payload: true,
          });
        }
      }).catch((err) => {
        throw err;
      });

    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/getPrice')
      .then((res) => {
        if (res) {
          console.log(res.data);
          this.setState({ totalprice: res.data.total_price });
        }
      }).catch((err) => {
        throw err;
      });

    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/getUserDeets')
      .then((res) => {
        if (res) {
          this.setState({ name: res.data.name });
          this.setState({ add1: res.data.add1 });
          this.setState({ add2: res.data.add2 });
          this.setState({ contact: res.data.contact });
          this.setState({ email: res.data.email });
        }
      }).catch((err) => {
        console.log(`User Profile: ${err}`);
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSuccess() {
    this.setState({ redirect: true });
  }

  updateProfile = (data) => {
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/updateordProfile', data)
      .then((res) => {
        if (res) {
          console.log('Updated');
        }
      }).catch((err) => {
        console.log(`User Update Profile: ${err}`);
      });
  }

  updateUser = (e) => {
    e.preventDefault();
    const userData = {
      name: this.state.name,
      add1: this.state.add1,
      add2: this.state.add2,
      email: this.state.email,
      contact: this.state.contact,
    };
    this.updateProfile(userData);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // const finalorderint = parseFloat(event.target.id, 10);
    // console.log(finalorderint);
    // this.setState({ finalorder: finalorderint });
    const {
      products,
    } = this.state;
    // eslint-disable-next-line no-plusplus
    console.log(products);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/order', products)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log(response);
        const status = response.status;
        if (status !== 200) {
          this.setState({
            redirect: false,
          });
        } else {
          this.setState({
            // redirect: true,
            isOpen: true,
          });
          this.updateIns();
        }
      });
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/cartorder', products)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log(response);
        const status = response.status;
        if (status !== 200) {
          this.setState({
            redirect: false,
          });
        } else {
          // this.setState({
          //   redirect: true,
          // });
          console.log('Done!');
        }
      });
  }

  handleInstructions = (e) => {
    const Spc = [];
    const spobj = {
      sp_id: e.target.id,
      SpIns: e.target.value,
    };
    Spc.push(spobj);
    this.setState({
      SplInv: Spc,
    });
    console.log(this.state.SplInv);
    console.log(Spc);
  }

  handleDelete = (event) => {
    event.preventDefault();
    const orderNum = parseInt(event.target.id, 10);
    const visitdata = {
      po_id: orderNum,
    };
    console.log(visitdata);
    this.setState({
      po_id: visitdata,
    });
    console.log(this.state.po_id);
    console.log(this.state.redirectVar);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/deletefromcart', visitdata)
      .then((res) => {
        console.log(res.status);
      });
  }

  openModal = () => this.setState({ isOpen: true });

  closeModal = () => this.setState({ isOpen: false, redirect: true });

  updateIns() {
    console.log('Here');
    const {
      SplInv,
    } = this.state;
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/orderIns', SplInv)
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log(response);
        const status = response.status;
        if (status !== 200) {
          this.setState({
            redirect: false,
          });
        } else {
          // this.setState({
          //   redirect: true,
          // });
          console.log('SP INS Added!');
        }
      });
  }

  render() {
    console.log(this.state.products);
    console.log(this.state.currentDateTime);
    const orderValue = Math.round(((this.state.totalprice) + Number.EPSILON) * 100) / 100;
    const taxes = Math.round(((orderValue / 10) + Number.EPSILON) * 100) / 100;
    const serviceFee = Math.round(((orderValue / 7.5) + Number.EPSILON) * 100) / 100;
    const totalvalue = orderValue + taxes + serviceFee;
    const totalordervalue = Math.round(((totalvalue) + Number.EPSILON) * 100) / 100;
    console.log(orderValue);
    let redirectVar = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to="/order" />;
    }
    if (!this.state.isOpen) {
      return (
        <div>
          {redirectVar}
          <NavBar />
          <div>
            <div><h3 style={{ paddingLeft: '0.5em' }}>Checkout</h3></div>
            <table>
              <thead>
                <tr>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>CID</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Restaurant Name</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Dish Name</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Quantity</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Price</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Total Price</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Special Instructions</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Delete from Cart</td>
                  {/* <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Delete</td> */}
                </tr>
              </thead>
              <tbody>
                {this.state.products.map((item, i) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                  <tr>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{i + 1}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.name}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.p_name}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.p_price}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{Math.round(((item.p_price * item.quantity) + Number.EPSILON) * 100) / 100}</td>
                    <td><input type="text" id={item.po_id} placeholder="Add a note for the store" style={{ width: '390px', height: '35px' }} onChange={this.handleInstructions} /></td>
                    <td><input type="button" id={item.po_id} value="Delete" style={{ width: '100px', height: '30px', backgroundColor: '#fc465a' }} onClick={this.handleDelete} /></td>
                    {/* <td><input type="button" value="Delete" style={{ width: '100px', height: '30px', backgroundColor: '#FF0000' }} /></td> */}
                  </tr>)}
              </tbody>
            </table>
            <div>
              Subtotal:
              $
              {orderValue}
            </div>
            <div>
              Taxes:
              $
              {taxes}
            </div>
            <div>
              Service Fee:
              $
              { serviceFee }
            </div>
            <div>
              Total Price:
              $
              { totalordervalue }
            </div>
            <br />
            <div>
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-xs" />
                  <div className="col-xs">
                    <HeadText>
                      Confirm Delivery Details
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
                      Contact
                      <br />
                      <input type="text" name="contact" defaultValue={this.state.contact} placeholder=" Contact " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
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
                      <input type="text" name="email" defaultValue={this.state.email} placeholder=" Email " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
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
                      New Address?
                      <br />
                      <input type="text" name="add2" defaultValue={this.state.add2} placeholder=" New Address? " style={{ width: '390px', height: '35px' }} onChange={this.handleChange} required />
                      <br />
                    </OverallText>
                  </div>
                </div>
                <button type="submit" onClick={this.updateUser} style={{ width: '390px', height: '35px', backgroundColor: '#7bb420' }}>Update</button>
              </form>
              <br />
            </div>
            <input type="button" id={totalordervalue} value="Order" style={{ width: '100px', height: '35px', backgroundColor: '#7bb420' }} onClick={this.handleSubmit} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          {redirectVar}
          <NavBar />
          <div>
            <div><h3 style={{ paddingLeft: '0.5em' }}>Checkout</h3></div>
            <Modal show={this.state.isOpen} onHide={this.closeModal}>
              <Modal.Header>
                <Modal.Title>Order placed successfully!</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button variant="success" onClick={() => { this.closeModal(event); this.handleSuccess(event); }}>
                  Proceed to Orders
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { userCheckoutVisit: state.userCheckoutVisit };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(checkout);
