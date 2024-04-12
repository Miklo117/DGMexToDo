/* eslint-disable no-var */
import React from 'react';
// nodejs library that concatenates classes
import classnames from 'classnames';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// import images
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Navbar,
  Nav,
  Container,
} from 'reactstrap';
import team4 from '../../assets/img/default-avatar.png';
import logo from '../../assets/img/deaceroLogo.PNG';

import Idioma from './Idioma';

// reactstrap components
import { logOut, getSessionItem, Translate } from '../../utils/utils';

class AdminNavbar extends React.Component {
  constructor(props){
    super(props);
    this.onChangeIdioma = this.onChangeIdioma.bind(this);
  }

  onChangeIdioma(e) {
    var d = new Date();
    this.setState({ date: d });
    this.props.onChangeIdiomaCallback(e);
    this.forceUpdate();
  }
  
  render() {
    return (
      <>
        <Navbar
          className={classnames(
            'navbar-top navbar-expand border-bottom',
            { 'navbar-dark bg-info': this.props.theme === 'dark' },
            { 'navbar-light bg-secondary': this.props.theme === 'light' }
          )}
        >
          <Container fluid>
            <Collapse navbar isOpen>
              <Nav className="align-items-left" navbar>
                <img src={logo} alt="deaceroLogo" style={{ width: '18%' }} />
              </Nav>
              <Nav className="align-items-center ml-md-auto" navbar>
                <Idioma claIdioma={this.props.claIdioma} onChangeIdiomaCallback={this.onChangeIdioma} />
              </Nav>
              <Nav className="align-items-center ml-auto ml-md-0" navbar style={{ width: '35%' }}>
                <UncontrolledDropdown nav style={{ cursor: 'pointer' }}>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center">
                      <span className="avatar avatar-sm rounded-circle">
                        <img alt="..." src={team4} />
                      </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {getSessionItem('NomUsuario', '')}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">{Translate("Admin.Welcome")}</h6>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="#salir" onClick={logOut}>
                      <i className="ni ni-user-run" />
                      <span>{Translate("Admin.Logout")}</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
AdminNavbar.defaultProps = {
  toggleSidenav: () => {},
  sidenavOpen: false,
  theme: 'dark',
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'light']),
};

export default AdminNavbar;
