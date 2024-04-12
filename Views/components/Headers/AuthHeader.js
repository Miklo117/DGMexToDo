import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// reactstrap components
import { Container, Row, Col } from 'reactstrap';
import logo from '../../assets/img/deaceroLogo.PNG';

class AuthHeader extends React.Component {
  render() {
    return (
      <>
        <div className="header bg-info py-7 py-lg-8 pt-lg-8">
          <Container>
            <div className="header-body text-center mb-3">
              <Row className="justify-content-center">
                <Col className="px-5" lg="6" md="8" xl="5">
                  <img src={logo} alt="deaceroLogo" style={{ width: '65%' }} />
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-default" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </div>
      </>
    );
  }
}

AuthHeader.propTypes = {
  title: PropTypes.string,
  lead: PropTypes.string,
};

export default AuthHeader;
