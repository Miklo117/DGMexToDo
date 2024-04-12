/*eslint-disable*/
import React from 'react';

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col, Label } from 'reactstrap';
import { config } from '../../utils/config';

class Calendar extends React.Component {
  render() {
    return (
      <>
        <Container fluid>
          <footer className="footer pt-0 fixed-bottom">
            <Row className="align-items-center justify-content-lg-between">
              <Col lg="6">
                <div className="copyright text-center text-xl-left text-muted">
                  © {new Date().getFullYear()}{' '}
                  <a
                    className="font-weight-bold ml-1"
                    href="https://www.deacero.com/"
                    target="_blank"
                  >
                    DEACERO SAPI DE CV
                  </a>
                </div>
              </Col>
              <Col lg="6">
                <div className="copyright text-center text-xl-right text-muted">
                  <Label
                    className="font-weight-bold ml-1"
                  >
                    {config.version}
                  </Label>
                </div>
                <Nav className="nav-footer justify-content-center justify-content-lg-end"></Nav>
              </Col>
            </Row>
          </footer>
        </Container>
      </>
    );
  }
}

export default Calendar;
