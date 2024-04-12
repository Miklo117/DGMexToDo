import React from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { Button, Col, Input, Row, Card, CardBody, Form, FormGroup, CardHeader } from 'reactstrap';
import { Translate, callApi2, getSessionItem, showSweetAlert, servicios } from '../../utils/utils';
import { config } from '../../utils/config.js';
import TextBox from 'devextreme-react/text-box';

class LoginRecuperarPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      claCUC: ''
    };

    this.onModalClose = this.onModalClose.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onClickAceptar = this.onClickAceptar.bind(this);
    this.handleSubmitAceptar = this.handleSubmitAceptar.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  async handleSubmitAceptar() {
    const urlService = `https://krakenapi.deacero.com/KrakenSecurity/4/2`;


    if (this.state.claCUC.length > 0) {
      const paramsSP = `{"LoginUserName":"${this.state.claCUC}"}`;

      const params = {
        parameters: paramsSP,
        tipoEstructura: 1,
      };

      callApi2(urlService, 'POST', params).then((res) => {
        showSweetAlert(Translate('RecoveryPass.CorreoMsg'), '', 'success');
      });
    } else {
      showSweetAlert(Translate('RecoveryPass.LenghtMsg'), '', 'error');
    }
  }

  onChangeUsername(e) {
    this.setState({ claCUC: e.event.target.value });
  }

  onModalClose() {
    this.props.onClose();
  }

  onClickAceptar() {
    this.handleSubmitAceptar();
  }

  keyPress(e) {
    if(e.event.code === "Enter"){
      this.handleSubmitAceptar();
    }
  }

  render() {
    return (
      <Popup
        visible={true}
        onHiding={this.onModalClose}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showCloseButton={false}
        showTitle={true}
        title={Translate('RecoveryPass.Titulo')}
        width={350}
        height={220}
        minWidth={420}
      >
        <Position
          at="center"
          my="center"
        />
        <ToolbarItem 
          widget="dxButton"
          toolbar="bottom"
          onClick={this.onClickAceptar} 
          id="btnVerifica"
        >
          <Button
            color="primary"
            type="button"
          >
            {Translate('RecoverLogin.Recuperar')}
          </Button>
        </ToolbarItem>
        <ToolbarItem 
          widget="dxButton"
          className="btn"
          toolbar="bottom"
          onClick={this.onModalClose}
        >
          <Button
            onClick={this.onModalClose}
            color="deffault"
            type="button"
          >
            {Translate('RecoverLogin.Regresar')}
          </Button>
        </ToolbarItem>
        <FormGroup>
          <TextBox 
            placeholder={Translate('RecoverLogin.Cliente')}
            className="kar-input-login"
            onKeyPress={this.keyPress}
            onChange={this.onChangeUsername}
            required="*" 
          />
        </FormGroup>
            
      </Popup>
    );
  }
}

export default LoginRecuperarPassword;
