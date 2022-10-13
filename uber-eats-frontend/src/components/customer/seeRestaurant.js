/* eslint-disable dot-notation */
/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable max-len */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import NavBar from '../../NavBar';

class seeRestaurant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      po_id: 0,
      price: 0,
      redirectVar: false,
      name: '',
      location: '',
      description: '',
      // contact: '',
      timings: '',
      isOpen: false,
      // delivery: '',
      // pickup: '',
    };
  }

  componentDidMount() {
    const menuList = [];
    Axios.defaults.withCredentials = true;
    Axios.get('http://localhost:3001/sr')
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
            type: 'USER_RESTAURANT_MENU',
            payload: true,
          });
        }
      }).catch((err) => {
        throw err;
      });
    Axios.defaults.withCredentials = true;
    Axios.get('http://localhost:3001/sr1')
      .then((res) => {
        if (res.status === 200) {
          this.setState({ name: res.data[0].name });
          this.setState({ location: res.data[0].location });
          this.setState({ description: res.data[0].description });
          this.setState({ timings: res.data[0].timings });
        } else {
          console.log('Unable to fetch restaurant data');
        }
      });
  }

  closeModal = () => this.setState({ isOpen: false });

  handleCart = (event) => {
    event.preventDefault();
    const orderNum = parseInt(event.target.id, 10);
    const visitdata = {
      p_id: orderNum,
      price: event.target.value,
    };
    console.log(visitdata);
    this.setState({
      po_id: visitdata,
      price: event.target.value,
    });
    console.log(this.state.po_id);
    console.log(this.state.redirectVar);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/getCart')
      .then((res) => {
        if (res.data.length > 0) {
          if (res.data[0].name !== this.state.name) {
            console.log('Item present');
            this.setState({ isOpen: true });
            console.log(this.state.isOpen);
          } else {
            Axios.defaults.withCredentials = true;
            Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
            Axios.post('http://localhost:3001/addtocart', visitdata)
              .then((res) => {
                console.log(res.status);
                this.setState({ redirectVar: true });
              });
          }
        } else {
          Axios.defaults.withCredentials = true;
          Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          Axios.post('http://localhost:3001/addtocart', visitdata)
            .then((res) => {
              console.log(res.status);
              this.setState({ redirectVar: true });
            });
        }
      });
  }

  handleNew = (e) => {
    console.log(e.target.value);
    Axios.defaults.withCredentials = true;
    Axios.post('http://localhost:3001/cartorder')
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log(response);
        const { status } = response.status;
        if (status !== 200) {
          this.setState({
            isOpen: false,
          });
        } else {
          this.setState({
            isOpen: true,
          });
        }
      });
  }

  render() {
    console.log(this.state.products);
    return (
      <div>
        <NavBar />
        <div>
          <Card style={{ paddingLeft: '6rem' }}>
            <Card.Header as="h4">{this.state.name}</Card.Header>
            <Card.Text className="mb-2 text-muted">{this.state.description}</Card.Text>
            <Card.Text className="mb-2 text-muted">
              {this.state.location}
              &nbsp; &nbsp; &nbsp;
              {this.state.timings}
              </Card.Text>
          </Card>
        </div>
        <div>
          <Form inline>
            <Container>
              <Row>
              {this.state.products.map((item) => <Col>
               <Card style={{ width: '20rem', margin: '2rem' }}>
                <Card.Img variant="top" src={item.uploadURL} style={{ height: '250px' }} />
                <Card.Body>
                  <Card.Title>{item.p_name}</Card.Title>
                  <Card.Text>
                    {item.p_ingredients}
                    <br />
                  </Card.Text>
                  <Card.Text>
                    $
                    {item.p_price}
                  </Card.Text>
                  <Button variant="success" id={item.p_id} value={item.p_price} name={this.state.name} onClick={this.handleCart}>Add To Cart</Button>
                </Card.Body>
              </Card>
              </Col>)}
              </Row>
            </Container>
          </Form>
          <Modal show={this.state.isOpen} onHide={this.closeModal}>
            <Modal.Header>
              <Modal.Title>Create New Order?</Modal.Title>
            </Modal.Header>
            <div>
              <Form.Group>
                <Modal.Body>
                  Your order contains items from a different Restaurant.
                  Create a new order to add items from &nbsp;
                  {this.state.name}
                </Modal.Body>
              </Form.Group>
            </div>
            <Modal.Footer>
              <Button variant="success" onClick={this.handleNew}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={this.closeModal}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { userRestMenu: state.userRestMenu };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(seeRestaurant);
