/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable dot-notation */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import NavBar from '../../NavBar';

class addToCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      po_id: 0,
      redirect: false,
      isOpen: true,
      quantity: 0,
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
            type: 'USER_CART_VISIT',
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

  openModal = () => this.setState({ isOpen: true });

  closeModal = () => this.setState({ isOpen: false, redirect: true });

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      products,
    } = this.state;
    console.log(products);
    this.setState({ redirect: true });
  }

  handleChange = (e) => {
    console.log(e.target.name);
    this.setState({ quantity: e.target.value });
    const upquantity = {
      po_id: e.target.id,
      quantity: e.target.value,
    };
    console.log(upquantity);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/updatequantity', upquantity)
      .then((res) => {
        console.log(res.status);
      });
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
    this.forceUpdate();
  }

  render() {
    console.log(this.state.products);
    let redirectVar = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to="/checkout" />;
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>
          <div><h3 style={{ paddingLeft: '0.5em' }}>Cart</h3></div>
          <Modal show={this.state.isOpen} onHide={this.closeModal}>
            <Modal.Header>
              <Modal.Title>Cart Details</Modal.Title>
            </Modal.Header>
            {this.state.products.map((item) => <div>
              <Form.Group>
                <Modal.Body>
                  {item.name}
                  <br />
                  {item.p_name}
                  <Form.Control type="number" style={{ width: '4rem' }} id={item.po_id} name={item.p_price} onChange={this.handleChange} placeholder="1" />
                  $
                  {item.p_price}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button variant="outline-danger" id={item.po_id} onClick={this.handleDelete}>
                    Delete
                  </Button>
                </Modal.Body>
              </Form.Group>
            </div>)}
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { this.closeModal(event); this.handleSubmit(event); }}>
                Proceed to Checkout
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { userCartVisit: state.userCartVisit };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(addToCart);
