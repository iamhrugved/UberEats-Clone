/* eslint-disable no-restricted-globals */
/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable object-shorthand */
/* eslint-disable brace-style */
/* eslint-disable arrow-body-style */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import './paginate.css';
import NavBar from '../../NavBar';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class userorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filter: false,
      inOS: '',
      order_id: '',
      offset: 0,
      perPage: 5,
      currentPage: 0,
      tabledata: [],
      isOpen: false,
      redirect: false,
      toastcancel: false,
      // pageNumber: '',
      // po_id: 0,
      // redirectVar: false,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(props, state) {
    if (state.perPage !== this.state.perPage) {
      console.log('input changed');
      this.getData();
    }
  }

  handleOk() {
    this.setState({ isOpen: false });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
      currentPage: selectedPage,
      offset: offset,
    }, () => {
      this.loadMoreData();
    });
  }

  getData() {
    // const menuList = [];
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.get('http://localhost:3001/orderstatus')
      .then((res) => {
        const data = res.data;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          products: res.data,
          tabledata: slice,
        });
        this.props.dispatch({
          type: 'USER_ORDER',
          payload: true,
        });
      });
  }

  openModal = () => this.setState({ isOpen: true });

  closeModal = () => this.setState({
    isOpen: false,
  });

  handleDelete = (event) => {
    event.preventDefault();
    const orderNum = event.target.id;
    const visitdata = {
      order_id: orderNum,
    };
    console.log(visitdata);
    this.setState({
      order_id: visitdata,
    });
    console.log(this.state.order_id);
    console.log(this.state.redirectVar);
    console.log(event.target.value);
    if (event.target.value === 'Ordered') {
      Axios.defaults.withCredentials = true;
      Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      Axios.post('http://localhost:3001/updateordercan', visitdata)
        .then((res) => {
          console.log(res.status);
          this.setState({ toastcancel: true });
        });
      this.forceUpdate();
    }
    else {
      this.setState({
        isOpen: true,
      });
    }
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
    Axios.post('http://localhost:3001/uorderdeets', visitdata)
      .then((res) => {
        console.log(res.status);
        this.setState({ redirect: true });
      });
  }

  handleChangeOS = (e) => {
    this.setState({ inOS: e.target.value });
    console.log(e.target.value);
  }

  handlePageDrop = (e) => {
    const pageI = parseInt(e.target.value, 10);
    this.setState({ perPage: pageI });
    console.log(e.target.value);
    console.log(this.state.perPage);
  }

  finalFilter = (filData) => {
    console.log(filData);
    Axios.defaults.withCredentials = true;
    Axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    Axios.post('http://localhost:3001/filteruorders', filData)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ products: res.data });
          this.setState({ filter: true });
        } else {
          // this.setState({ search: false });
        }
      });
  }

  notify = () => {
    toast.success('Order Cancelled!');
  };

  handleFilter = (e) => {
    e.preventDefault();
    const filData = {
      inOS: this.state.inOS,
    };
    this.finalFilter(filData);
  }

  loadMoreData() {
    const data = this.state.products;
    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      tabledata: slice,
    });
  }

  render() {
    console.log(this.state.products);
    let redirectVar = null;
    let CancelToast = null;
    if (this.state.redirect) {
      redirectVar = <Redirect to="/uorderdeets" />;
    }
    if (this.state.toastcancel) {
      CancelToast = this.notify();
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
                <Modal.Title>Restaurant has already processed your order!</Modal.Title>
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
    else if (!this.state.filter) {
      return (
        <div>
          <NavBar />
          {redirectVar}
          {CancelToast}
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
            <div><h3>&nbsp;&nbsp;Orders</h3></div>
            <table>
              <thead>
                <tr>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Restaurant Name</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Location</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Contact</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Time</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Status</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Details</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Cancel Order</td>
                </tr>
              </thead>
              <tbody>
                {this.state.tabledata.map((item) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                  <tr>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.name}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.location}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.contact}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.ordertime}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.order_status}</td>
                    <td><Button variant="dark" id={item.ordertime} onClick={this.onClickButton}>Order Details</Button></td>
                    <td><Button variant="danger" id={item.ordertime} value={item.order_status} onClick={this.handleDelete}>Cancel Order</Button></td>
                  </tr>)}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel="Prev"
              nextLabel="Next"
              breakLabel="..."
              breakClassName="break-me"
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
            />
            <label>
              &nbsp;&nbsp;
              Number of Orders: &nbsp;
              <select onChange={this.handlePageDrop}>
                <option>Select</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </label>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <NavBar />
          {redirectVar}
          {CancelToast}
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
            <div><h3>&nbsp;&nbsp;Orders</h3></div>
            <table>
              <thead>
                <tr>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Restaurant Name</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Location</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Contact</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Time</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Status</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Order Details</td>
                  <td style={{ textAlign: 'left', padding: '1em', paddingTop: '2em' }}>Cancel Order</td>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map((item) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                  <tr>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.name}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.location}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.contact}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.ordertime}</td>
                    <td style={{ textAlign: 'left', padding: '1em' }}>{item.order_status}</td>
                    <td><Button variant="dark" id={item.ordertime} onClick={this.onClickButton}>Order Details</Button></td>
                    <td><Button variant="danger" id={item.ordertime} value={item.order_status} onClick={this.handleDelete}>Cancel Order</Button></td>
                  </tr>)}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel="Prev"
              nextLabel="Next"
              breakLabel="..."
              breakClassName="break-me"
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
            />
            <label>
              &nbsp;&nbsp;
              Number of Orders: &nbsp;
              <select onChange={this.handlePageDrop}>
                <option>Select</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </label>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return { userOrders: state.userOrders };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(userorder);
