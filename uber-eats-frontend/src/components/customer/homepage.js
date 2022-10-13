/* eslint-disable dot-notation */
/* eslint-disable no-else-return */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
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
// import { Image as CloudinaryImage } from 'cloudinary-react';
import NavBar from '../../NavBar';

class homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      inSearch: '',
      inDelivery: '',
      inV: '',
      redirectVar: false,
      search: false,
      resultTable: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeD = this.handleChangeD.bind(this);
    this.handleChangeV = this.handleChangeV.bind(this);
  }

  componentDidMount() {
    const restList = [];
    Axios.defaults.withCredentials = true;
    Axios.get('http://localhost:3001/allrest')
      .then((res) => {
        if (res) {
          console.log(res.data);
          if (res.data.length >= 0) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < res.data.length; i++) {
              restList.push(res.data[i]);
            }
          }
          this.setState({ products: restList });
          this.props.dispatch({
            type: 'USER_HOMEPAGE',
            payload: true,
          });
        }
      }).catch((err) => {
        throw err;
      });
  }

  finalSearch = (userData) => {
    console.log(userData);
    Axios.defaults.withCredentials = true;
    Axios.post('http://localhost:3001/searchItem', userData)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          this.setState({ resultTable: res.data });
          this.setState({ search: true });
        } else {
          // this.setState({ search: false });
        }
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChangeD = (e) => {
    this.setState({ inDelivery: e.target.value });
    console.log(e.target.value);
  }

   handleChangeV = (e) => {
     this.setState({ inV: e.target.value });
     console.log(e.target.value);
   }

  handleSearch = (e) => {
    e.preventDefault();
    const userData = {
      inSearch: this.state.inSearch,
      inDelivery: this.state.inDelivery,
      inV: this.state.inV,
    };
    this.finalSearch(userData);
  }

  handleVisit = (event) => {
    event.preventDefault();
    const visitdata = {
      email: event.target.value,
    };
    console.log(visitdata);
    this.setState({
      remail: visitdata,
      redirectVar: true,
    });
    console.log(this.state.remail);
    console.log(this.state.redirectVar);
    Axios.defaults.withCredentials = true;
    Axios.post('http://localhost:3001/sr', visitdata)
      .then((res) => {
        console.log(res.status);
      });
  }

  handleFavourite = (event) => {
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
    Axios.post('http://localhost:3001/markfavourite', visitdata)
      .then((res) => {
        console.log(res.status);
      });
  }

  enterPressed = (event) => {
    const ser = { inSer: this.state.inSearch };
    console.log(ser);
    const code = event.keyCode || event.which;
    if (code === 13) {
      Axios.defaults.withCredentials = true;
      Axios.post('http://localhost:3001/searchOI', ser)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            this.setState({ resultTable: res.data });
            this.setState({ search: true });
          } else {
            this.setState({ search: false });
          }
        });
    }
  }

  render() {
    console.log(this.state.products);
    console.log(this.state.resultTable);
    let redirectVar = null;
    if (this.state.redirectVar) {
      redirectVar = <Redirect to="/seerestaurant" />;
    }
    if (!this.state.search) {
      return (
      <div>
        <NavBar />
        {redirectVar}
        <div>
            <Form inline>
                <Container>
                    <Row>
                        <Col>
                        <input type="text" name="inSearch" placeholder=" Search Dish Name, Restaurants, Cuisine, Locations " style={{ width: '500px', height: '35px' }} onChange={this.handleChange} onKeyPress={this.enterPressed.bind(this)} required />
                        &nbsp; &nbsp; &nbsp;
                        <label>
                        Type of Delivery:
                        <select onChange={this.handleChangeD}>
                          <option value="All">Select</option>
                          <option value="Delivery">Delivery</option>
                          <option value="Pickup">Pickup</option>
                          </select>
                        </label>
                        &nbsp; &nbsp; &nbsp;
                        <label>
                        Type of Food:
                        <select onChange={this.handleChangeV}>
                        <option value="All">Select</option>
                          <option value="NonVeg">NonVeg</option>
                          <option value="Veg">Veg</option>
                          <option value="Vegan">Vegan</option>
                          </select>
                        </label>
                        &nbsp; &nbsp; &nbsp;
                        <Button type="submit" onClick={this.handleSearch}>Search</Button>
                        </Col>
                    </Row>
                    </Container>
                    </Form>
          <Form inline>
            <Container>
              <Row>
              {this.state.products.map((item) => <Col>
               <Card style={{ width: '20rem', margin: '2rem' }}>
                <Card.Img
                  variant="top"
                  src={item.uploadURL}
                  style={{ height: '250px' }}
                />
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
                  <Button variant="success" id={item.p_id} value={item.email} onClick={this.handleVisit}>Visit</Button>
                  <Button variant="outline-warning" size="sm" id={item.email} value={item.email} onClick={this.handleFavourite}>Favourite</Button>
                </Card.Body>
              </Card>
              </Col>)}
              </Row>
            </Container>
          </Form>
        </div>
      </div>
      );
    } else {
      return (
      <div>
        <NavBar />
        {redirectVar}
        <div>
            <Form inline>
                <Container>
                    <Row>
                        <Col>
                        <input type="text" name="inSearch" placeholder=" Search Dish Name, Restaurants, Cuisine, Locations " style={{ width: '500px', height: '35px' }} onChange={this.handleChange} onKeyPress={this.enterPressed.bind(this)} required />
                        &nbsp; &nbsp; &nbsp;
                        <label>
                        Type of Delivery:
                        <select onChange={this.handleChangeD}>
                          <option value="All">Select</option>
                          <option value="Delivery">Delivery</option>
                          <option value="Pickup">Pickup</option>
                          </select>
                        </label>
                        &nbsp; &nbsp; &nbsp;
                        <label>
                        Type of Food:
                        <select onChange={this.handleChangeV}>
                        <option value="All">Select</option>
                          <option value="NonVeg">NonVeg</option>
                          <option value="Veg">Veg</option>
                          <option value="Vegan">Vegan</option>
                          </select>
                        </label>
                        &nbsp; &nbsp; &nbsp;
                        <Button type="submit" onClick={this.handleSearch}>Search</Button>
                        </Col>
                    </Row>
                    </Container>
                    </Form>
          <Form inline>
            <Container>
              <Row>
              {this.state.resultTable.map((item) => <Col>
               <Card style={{ width: '20rem', margin: '2rem' }}>
                <Card.Img
                  variant="top"
                  src={item.uploadURL}
                  style={{ height: '250px' }}
                />
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
                  <Button variant="success" id={item.p_id} value={item.email} onClick={this.handleVisit}>Visit</Button>
                  <Button variant="outline-warning" size="sm" id={item.email} value={item.email} onClick={this.handleFavourite}>Favourite</Button>
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
}

const mapStateToProps = (state) => {
  return { userHomepage: state.userHomepage };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(homepage);
