import React from 'react';
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import NavBar from '../../NavBar';

class resHome extends React.Component {
  render() {
    let redirectVar = null;
    if (!localStorage.getItem('ubereatsResToken')) {
      redirectVar = <Redirect to="/reslogin" />;
    }
    return (
      <div>
        <NavBar />
        <div>
          {redirectVar}
          <Form inline>
            <Container>
              <Row>
                <Col>
                  <Card style={{ width: '20rem', margin: '2rem' }}>
                    <Card.Body>
                      <Card.Title>Restaurant Profile</Card.Title>
                      <Card.Text>
                        View Restaurant Profile
                      </Card.Text>
                      <Button variant="primary" href="/resProfile" block>Profile</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ width: '20rem', margin: '2rem' }}>
                    <Card.Body>
                      <Card.Title>Customer Orders</Card.Title>
                      <Card.Text>
                        Orders placed by the customers.
                      </Card.Text>
                      <Button variant="primary" href="/resorders" block>Manage</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ width: '20rem', margin: '2rem' }}>
                    <Card.Body>
                      <Card.Title>Menu</Card.Title>
                      <Card.Text>
                        Add and Edit Dishes in the Menu.
                      </Card.Text>
                      <Button variant="primary" href="/resadditems" block>Menu</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Form>
        </div>
      </div>
    );
  }
}

export default resHome;
