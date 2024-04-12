/* eslint-disable no-var */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Route, Router, Redirect } from 'react-router-dom';
import classnames from 'classnames';
import env from '@beam-australia/react-env';
import LoginRecuperarPassword from './PasswordRecovery';
import {
  Button,
  Label,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';
import AuthHeader from 'components/Headers/AuthHeader';
import { config } from '../../utils/config';
import AdminLayout from '../../layouts/Admin';

import {
  setSessionData,
  sessionAlive,
  logOut,
  showSweetAlert,
  callApi2,
  getSessionItem,
  languageInit,
  Translate,
} from '../../utils/utils';

import Idioma from 'components/Navbars/Idioma.js';

const REACT_APP_VAR = env('VAR');
const REACT_APP_OTRO = env('OTRO');
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usuario: '',
      password: '',
      recuperarPasswordShow: false,
    };

    this.onChangeUsuario = this.onChangeUsuario.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onOpenLoginRecuperarPwr = this.onOpenLoginRecuperarPwr.bind(this);
    this.onCloseLoginRecuperarPwr = this.onCloseLoginRecuperarPwr.bind(this);

    this.onChangeIdioma = this.onChangeIdioma.bind(this);
  }

  onChangeIdioma(e) {
    var d = new Date();
    this.setState({ date: d, ClaIdioma: e });
    setSessionData({ ClaIdioma: e });
    this.forceUpdate();
  }

  async handleSubmit(e) {
    e.preventDefault();
    const urlWebService = `${config.UrlLoginServer}Login/authenticate`;

    const data = {
      username: this.state.usuario,
      password: this.state.password,
    };

    if (data.username === '' || data.password === '') {
      showSweetAlert('Precaución', 'Ingresar el usuario y contraseña', 'warning');
      return;
    }

    await callApi2(urlWebService, 'POST', data).then((res) => {
      if (!res.token) {
        showSweetAlert('Error', res.mensaje, 'error');
      } else {
        setSessionData({
          NomUsuario: res.nombreUsuario,
          Token: res.token,
          NumUsuario: data.username,
        });

        this.setState({
          numUsuario: data.username,
        });
      }
    });
  }

  keyPress(e) {
    if (e.code === 'Enter') {
      this.handleSubmit(e);
    }
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onCloseLoginRecuperarPwr() {
    this.setState({ recuperarPasswordShow: false });
  }

  onOpenLoginRecuperarPwr() {
    this.setState({ recuperarPasswordShow: true });
  }

  onChangeUsuario(e) {
    this.setState({
      usuario: e.target.value,
    });
  }

  componentDidMount() {
    document.body.classList.add('bg-default');
  }

  componentWillUnmount() {
    document.body.classList.remove('bg-default');
  }

  render() {
    // console.log('REACT_APP_VAR', REACT_APP_VAR);
    // console.log('REACT_APP_OTRO', REACT_APP_OTRO);
    if (sessionAlive()) {
      const url = getSessionItem('url', '/layout');
      document.body.classList.remove('bg-default');
      // Primer componente al que se va a redirigir después de iniciar sesión
      return (
        <Router history={this.props.history}>
          <Route path="/" render={(props) => <AdminLayout {...props} />} />
          <Redirect from="/" to={url} />
        </Router>
      );
    }
    logOut();
    document.body.classList.add('bg-default');

    languageInit();

    const loginRecoveryPassword =
      this.state.recuperarPasswordShow === true ? (
        <LoginRecuperarPassword onClose={this.onCloseLoginRecuperarPwr} />
      ) : (
        <div></div>
      );

    return (
      <>
        <AuthHeader />
        <Container className="mt--7 pb-5">
          <Row className="justify-content-center">
            <Col lg="6" md="7">
              <Idioma
                claIdioma={getSessionItem('ClaIdioma', 1)}
                onChangeIdiomaCallback={this.onChangeIdioma}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg="6" md="7">
              <Card className="card-login bg-secondary border-0 mb-0">
                <CardBody className="card-login px-lg-5 py-lg-5">
                  <Form role="form">
                    <FormGroup
                      className={classnames('mb-3', {
                        focused: this.state.focusedEmail,
                      })}
                    >
                      <div className="mb-2">
                        <span className="kar-label">{Translate('Login.User')}</span>
                      </div>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="kar-input-login">
                            <i className="far fa-user kar-icon-color" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          className="kar-input-login"
                          onKeyPress={this.keyPress}
                          onChange={this.onChangeUsuario}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup
                      className={classnames({
                        focused: this.state.focusedPassword,
                      })}
                    >
                      <div className="mb-2">
                        <span className="kar-label mb-1">{Translate('Login.Password')}</span>
                      </div>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="kar-input-login">
                            <i className="fas fa-unlock-alt kar-icon-color" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          className="kar-input-login"
                          onKeyPress={this.keyPress}
                          onChange={this.onChangePassword}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button
                        onClick={this.handleSubmit}
                        color="warning"
                        type="button"
                        style={{ width: '30%' }}
                      >
                        {Translate('Login.Enter')}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <Row className="mt-3">
                <Col xs="6">
                  <a className="text-light" href="#ForgotPassword" onClick={(e) => e.preventDefault()}>
                    <small onClick={this.onOpenLoginRecuperarPwr}>
                      {Translate('Login.ForgotPassword')}
                    </small>
                  </a>
                </Col>
                <Col xs="6" className='copyright text-center text-xl-right text-muted'>
                  <Label
                    className="font-weight-bold ml-1"
                  >
                    {config.version}
                  </Label>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        {loginRecoveryPassword}
      </>
    );
  }
}

export default Login;
