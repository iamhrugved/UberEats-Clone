/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
/* eslint-disable brace-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Modal,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import NavBar from '../../NavBar';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class resorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      order_id: '',
      actions: '',
      redirect: false,
      inOS: '',
      filter: false,
      isOpen: false,
      notifyUpdate: false,
      modalOpen: false,
      customerProf: [],
    };
  }

  componentDidMount() {
    const menuList = [];
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/resorderstatus')
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
            type: 'RESTAURANT_ORDER_MANAGEMENT',
            payload: true,
          });
        }
      }).catch((err) => {
        throw err;
      });
  }

  // componentDidUpdate(props, state) {
  //   if (state.inOS !== this.state.inOS) {
  //     console.log('input changed');
  //   }
  // }
  handleOk() {
    this.setState({ isOpen: false, modalOpen: false });
  }

  openModal = () => this.setState({ isOpen: true, modalOpen: true });

  closeModal = () => this.setState({
    isOpen: false,
    modalOpen: false,
  });

  finalFilter = (filData) => {
    console.log(filData);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/filteresorders', filData)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ products: res.data });
          this.setState({ filter: true });
        } else {
          // this.setState({ search: false });
        }
      });
  }

  finalActions = (actionData) => {
    console.log(actionData);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/resorderactions', actionData)
      .then((res) => {
        if (res.status === 200) {
          // console.log('A');
          this.setState({ notifyUpdate: false });
        } else {
          // this.setState({ search: false });
        }
      });
  }

  handleChangeOS = (e) => {
    this.setState({ inOS: e.target.value });
    console.log(e.target.value);
  }

  handleChangeActions = (e) => {
    this.setState({
      order_id: e.target.id,
      actions: e.target.value,
    });
  }

  handleActions = (e) => {
    e.preventDefault();
    this.setState({
      order_id: e.target.id,
    });
    const actionData = {
      order_id: this.state.order_id,
      actions: this.state.actions,
    };
    if (e.target.value === 'Cancelled') {
      this.setState({ isOpen: true });
    } else {
      this.finalActions(actionData);
    }
  }

  notify = () => {
    toast.success('Order Status Updated!');
  };

  handleFilter = (e) => {
    e.preventDefault();
    const filData = {
      inOS: this.state.inOS,
    };
    this.finalFilter(filData);
  }

  onClickButton = (event) => {
    event.preventDefault();
    const orderNum = event.target.id;
    const visitdata = {
      order_id: orderNum,
    };
    console.log(visitdata);
    this.setState({
      order_id: event.target.id,
    });
    console.log(this.state.order_id);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/rorderdeets', visitdata)
      .then((res) => {
        console.log(res.status);
        this.setState({ redirect: true });
      });
  }

  profileVisit = (event) => {
    event.preventDefault();
    const userProfile = event.target.id;
    const visitdata = {
      user_email: userProfile,
    };
    console.log(visitdata);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/userorderprof_p', visitdata)
      .then((res) => {
        console.log(res.status);
        Axios.defaults.withCredentials = true;
        Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        Axios.get('http://localhost:3001/userorderprof_g', visitdata)
          .then((res) => {
            console.log(res.data);
            this.setState({ customerProf: res.data });
            this.setState({ modalOpen: true });
          });
        // this.setState({ redirect: true });
      });
  }

  render() {
    console.log(this.state.products);
    let redirectVar = null;
    let UpdateNotif = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to="/rorderdeets" />;
    }
    if (this.state.notifyUpdate) {
      UpdateNotif = this.notify();
    }
    if (this.state.isOpen) {
      return (
        <div>
          {redirectVar}
          <NavBar />
          <div>
            <div><h3 style={{ paddingLeft: '0.5em' }}>Orders</h3></div>
            <Modal show={this.state.isOpen} onHide={this.closeModal}>
              <Modal.Header>
                <Modal.Title>Order has been Cancelled!</Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button variant="warning" onClick={() => { this.closeModal(event); this.handleOk(event); }}>
                  Proceed to Orders
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      );
    }
    else if (this.state.modalOpen) {
      return (
        <div>
          {redirectVar}
          <NavBar />
          <div>
            <div><h3 style={{ paddingLeft: '0.5em' }}>Customer Profile</h3></div>
            <Modal show={this.state.modalOpen} onHide={this.closeModal}>
              <Modal.Header>
                <Modal.Title>Customer Profile</Modal.Title>
              </Modal.Header>
              <div>
                <Form.Group>
                  <Modal.Body>
                    Name: &nbsp;
                    {this.state.customerProf.name}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Contact: &nbsp;
                    {this.state.customerProf.contact}
                    <br />
                    Email: &nbsp;
                    {this.state.customerProf.email}
                    <br />
                    Address: &nbsp;
                    {this.state.customerProf.add1}
                    <br />
                    Delivery Address: &nbsp;
                    {this.state.customerProf.add2}
                    <br />
                    Nickname: &nbsp;
                    {this.state.customerProf.nickname}
                    <br />
                    About: &nbsp;
                    {this.state.customerProf.about}
                    <br />
                    State: &nbsp;
                    {this.state.customerProf.state}
                    <br />
                    Customer Pic: &nbsp;
                    <Card.Img
                      variant="top"
                      src={this.state.customerProf.uploadURL}
                      style={{ height: '300px', width: '370px' }}
                    />
                  </Modal.Body>
                </Form.Group>
              </div>
              <Modal.Footer>
                <Button variant="warning" onClick={() => { this.closeModal(event); this.handleOk(event); }}>
                  View Orders
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      );
    }
    else if (!this.state.filter) {
      return (
        <div>
          <NavBar />
          {redirectVar}
          {UpdateNotif}
          <div>
            <Form inline>
              <Container>
                <Row>
                  <Col>
                    <label>
                      Order Status: &nbsp;
                      <select onChange={this.handleChangeOS}>
                        <option>Select</option>
                        <option value="Ordered">Order Received</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Preparing">Preparing</option>
                        <option value="On The Way">On The Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pick Up Ready">Pick Up Ready</option>
                        <option value="Picked Up">Picked Up</option>
                      </select>
                    </label>
                        &nbsp; &nbsp; &nbsp;
                    <Button type="submit" onClick={this.handleFilter}>Filter Order</Button>
                  </Col>
                </Row>
              </Container>
            </Form>
            <div><h3>&nbsp;&nbsp;Order Management</h3></div>
            <table>
              <thead>
                <tr>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>OID</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Customer Name</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Profile</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Location</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Contact</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Time</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Status</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Details</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Change Order Status</td>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map((item, i) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                  <tr>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{i + 1}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.name}</td>
                    <Button variant="info" id={item.email} onClick={this.profileVisit}>View</Button>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.location}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.contact}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.ordertime}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.order_status}</td>
                    <td><Button variant="dark" id={item.ordertime} onClick={this.onClickButton}>Order Details</Button></td>
                    <label>
                      <select onChange={this.handleChangeActions}>
                        <option>Select</option>
                        <option value="Ordered">Order Received</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Preparing">Preparing</option>
                        <option value="On The Way">On The Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pick Up Ready">Pick Up Ready</option>
                        <option value="Picked Up">Picked Up</option>
                      </select>
                    </label>
                        &nbsp; &nbsp; &nbsp;
                    <Button type="submit" id={item.ordertime} value={item.order_status} onClick={this.handleActions}>Confirm Action</Button>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <NavBar />
          {redirectVar}
          {UpdateNotif}
          <div>
            <Form inline>
              <Container>
                <Row>
                  <Col>
                    <label>
                      Order Status: &nbsp;
                      <select onChange={this.handleChangeOS}>
                        <option>Select</option>
                        <option value="Ordered">Order Received</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Preparing">Preparing</option>
                        <option value="On The Way">On The Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pick Up Ready">Pick Up Ready</option>
                        <option value="Picked Up">Picked Up</option>
                      </select>
                    </label>
                        &nbsp; &nbsp; &nbsp;
                    <Button type="submit" onClick={this.handleFilter}>Filter Order</Button>
                  </Col>
                </Row>
              </Container>
            </Form>
            <div><h3>&nbsp;&nbsp;Order Management</h3></div>
            <table>
              <thead>
                <tr>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>OID</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Customer Name</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Profile</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Location</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Contact</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Time</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Status</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Details</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Change Order Status</td>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map((item, i) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                  <tr>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{i + 1}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.name}</td>
                    <Button variant="info" id={item.email} onClick={this.profileVisit}>View</Button>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.location}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.contact}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.ordertime}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.order_status}</td>
                    <td><Button variant="dark" id={item.ordertime} onClick={this.onClickButton}>Order Details</Button></td>
                    <label>
                      <select onChange={this.handleChangeActions}>
                        <option>Select</option>
                        <option value="Ordered">Order Received</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Preparing">Preparing</option>
                        <option value="On The Way">On The Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pick Up Ready">Pick Up Ready</option>
                        <option value="Picked Up">Picked Up</option>
                      </select>
                    </label>
                        &nbsp; &nbsp; &nbsp;
                    <Button type="submit" id={item.ordertime} onClick={this.handleActions}>Confirm Action</Button>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { restOrders: state.restOrders };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(resorder);
