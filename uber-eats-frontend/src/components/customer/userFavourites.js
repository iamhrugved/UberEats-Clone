/* eslint-disable dot-notation */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import NavBar from '../../NavBar';

class userFavourites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      remail: '',
      redirect: false,
    //   finalorder: 0,
    };
  }

  componentDidMount() {
    const menuList = [];
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/getFavourites')
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
            type: 'USER_FAVOURITES',
            payload: true,
          });
        }
      }).catch((err) => {
        throw err;
      });
  }

  handleVisit = (event) => {
    event.preventDefault();
    const visitdata = {
      email: event.target.id,
    };
    console.log(visitdata);
    this.setState({
      remail: visitdata,
      redirect: true,
    });
    console.log(this.state.remail);
    console.log(this.state.redirect);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/sr', visitdata)
      .then((res) => {
        console.log(res.status);
      });
  }

  handleRemove = (event) => {
    event.preventDefault();
    const visitdata = {
      email: event.target.id,
    };
    console.log(visitdata);
    this.setState({
      remail: visitdata,
    });
    console.log(this.state.remail);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/deletefromfav', visitdata)
      .then((res) => {
        console.log(res.status);
      });
  }

  render() {
    console.log(this.state.products);
    let redirectVar = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to="/seerestaurant" />;
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>
          <div><h4>Favourite</h4></div>
          <Form inline>
            <Container>
              <Row>
                {this.state.products.map((item) => <Col>
                  <Card style={{ width: '20rem', margin: '2rem' }}>
                    <Card.Img variant="top" src={item.uploadURL} style={{ height: '250px' }} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        {item.description}
                      </Card.Text>
                      <Card.Text>
                        {item.location}
                    &nbsp; &nbsp; &nbsp;
                        {item.timings}
                      </Card.Text>
                      <Button variant="success" id={item.email} value={item.email} onClick={this.handleVisit}>Visit</Button>
                      <Button variant="outline-danger" size="sm" id={item.email} value={item.email} onClick={this.handleRemove}>Remove</Button>
                    </Card.Body>
                  </Card>
                </Col>)}
              </Row>
            </Container>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { userFavourites: state.userFavourites };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(userFavourites);
