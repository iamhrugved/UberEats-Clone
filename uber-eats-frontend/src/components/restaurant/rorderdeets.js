/* eslint-disable dot-notation */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import NavBar from '../../NavBar';

class rorderdeets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      redirect: false,
      openModal: true,
    };
  }

  componentDidMount() {
    const menuList = [];
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/rorderdeets')
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
            type: 'RESTAURANT_ORDER_DETAILS_RECEIPT',
            payload: true,
          });
        }
      }).catch((err) => {
        throw err;
      });
  }

  // componentDidUpdate(props, state) {
  //   if (state.quantity !== this.state.quantity) {
  //     console.log('input changed');
  //   }
  // }

  openModal = () => this.setState({ openModal: true });

  closeModal = () => this.setState({
    openModal: false,
    redirect: true,
  });

  render() {
    console.log(this.state.products);
    let redirectVar = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to="/resorders" />;
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>
          <div><h3 style={{ paddingLeft: '0.5em' }}>Order Details</h3></div>
          <Modal show={this.state.openModal} onHide={this.closeModal}>
            <Modal.Header>
              <Modal.Title>Customer Details</Modal.Title>
            </Modal.Header>
            {this.state.products.slice(0, 1).map((item) => <div>
              <Form.Group>
                <Modal.Body>
                  {item.name}
                  <br />
                  Address: &nbsp;
                  {item.add1}
                  <br />
                  Contact: &nbsp;
                  {item.contact}
                  <br />
                  Order Status: &nbsp;
                  {item.order_status}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Modal.Body>
              </Form.Group>
            </div>)}
            {this.state.products.map((item) => <div>
              <Form.Group>
                <Modal.Body>
                  Dish: &nbsp;
                  {item.p_name}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Quantity: &nbsp;
                  {item.quantity}
                  <br />
                  Special Instruction: &nbsp;
                  {item.sp_inst}
                </Modal.Body>
              </Form.Group>
            </div>)}
            <Modal.Footer>
              <Button variant="secondary" onClick={this.closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { restOrderReceipt: state.restOrderReceipt };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(rorderdeets);
