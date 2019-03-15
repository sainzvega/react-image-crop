import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import AppForm from './AppForm';
import AppForm2 from './AppForm2';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Container>
      <br />
      <br />
      <Row>
        <Col sm={{ size: '11', offset: 1 }}>
          <AppForm />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={{ size: '11', offset: 1 }}>
          <AppForm2 />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
