import React, { Component } from 'react';
import { Card, CardBody, FormGroup } from 'reactstrap';
import Form, { Item, GroupItem, ButtonItem, Label } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';
import { config } from '../../utils/config';
import { callApi, showNotify, notifyType, notifyPosition, callKrakenApi, Translate } from '../../utils/utils';

class UsuarioAlta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buscar: false,
      objUsuario: {
        ClaveEmpleado: '',
        claRol: 0,
        NombreEmpleado: '',
        ClaveUsuario: 0,
      },
    };

    this.btnBuscarHandleSubmit = this.btnBuscarHandleSubmit.bind(this);
    this.btnGuardarHandleSubmit = this.btnGuardarHandleSubmit.bind(this);
    this.btnCancelarHandle = this.btnCancelarHandle.bind(this);
    this.refForm = React.createRef();
  }

  /**
   * Regresa el objeto del formulario
   */
  get formUser() {
    return this.refForm.current ? this.refForm.current.instance : null;
  }

  /**
   * Funcion que se ejecuta al dar clic en el boton Buscar
   */
  btnBuscarHandleSubmit() {
    const dataForm = this.formUser.option('formData');
    const claEmpleado = dataForm.ClaveEmpleado;

    if (claEmpleado === '') {
      showNotify(
        Translate("Usuarios.Agregar.NotifyClaEmpleadoMissing"),
        notifyPosition.centerTop,
        notifyType.error
      );
      return;
    }

    const urlApiService = `${config.UrlApiProject}usuario/obtener/${claEmpleado}`;

    callApi(urlApiService, 'GET', null, (res) => {
      if (res.data.length > 0) {
        this.setState({
          objUsuario: {
            ClaveEmpleado: claEmpleado,
            NombreEmpleado: res.data[0].nombre,
            ClaveUsuario: res.data[0].claUsuario,
          },
        });
      } else {
        showNotify(Translate("Usuarios.Agregar.NotifyClaEmpleadoNoExist"), notifyPosition.centerTop, notifyType.error);
      }
    });
  }

  /**
   * Funcion que se ejecuta al dar clic en el boton Guardar
   */
  btnGuardarHandleSubmit() {
    const dataForm = this.formUser.option('formData');

    if (!dataForm.ClaveEmpleado || !dataForm.claRol) {
      showNotify(
        Translate('Usuarios.Agregar.NotifyClaEmpleadoInput'),
        notifyPosition.centerTop,
        notifyType.error
      );
      return;
    }

    const urlApiService = `${config.UrlApiProject}usuario/agregar`;

    const body = {
      ClaUsuario: dataForm.ClaveUsuario,
      BajaLogica: 0,
      ClaRol: dataForm.claRol,
    };

    callApi(urlApiService, 'POST', body, (res) => {
      showNotify(Translate('Usuarios.Agregar.NotifySaveSuccess'), notifyPosition.centerTop, notifyType.success);
      this.props.handler(false);
      window.location.reload();
    });
  }

  /**
   * Función del botón para cancelar la operación y ocultar el modal
   */
  btnCancelarHandle() {
    this.props.handler(false);
  }

  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <Form
              ref={this.refForm}
              key="formUser"
              formData={this.state.objUsuario}
              colCount={1}
              showColonAfterLabel={true}
              className="formUser"
              id="FormAltaUsuario"
            >
              <Item dataField="ClaveUsuario" visible={false} />
              <GroupItem colSpan={2} colCount={2}>
                <Item
                  dataField="ClaveEmpleado"
                  editorType="dxNumberBox"
                  editorOptions={{
                    placeholder: Translate('Usuarios.Agregar.ClaEmpleadoPlaceholder'),
                    onEnterKey: this.btnBuscarHandleSubmit,
                  }}
                >
                  <Label text={Translate("Usuarios.Agregar.ClaEmpleadoText")} />
                </Item>
                <ButtonItem
                  itemType="button"
                  horizontalAlignment="left"
                  buttonOptions={{
                    hint: Translate('Usuarios.Agregar.SearchIcon'),
                    icon: 'search',
                    type: 'default',
                    onClick: this.btnBuscarHandleSubmit,
                  }}
                />
              </GroupItem>
              <Item
                dataField="NombreEmpleado"
                editorOptions={{
                  placeholder: Translate('Usuarios.Agregar.NombreEmpleadoPlaceholder'),
                  disabled: true,
                }}
              >
                <Label text={Translate("Usuarios.Agregar.NombreEmpleadoText")} />
              </Item>

              <Item
                dataField="claRol"
                editorType="dxSelectBox"
                editorOptions={{
                  dataSource: this.props.roles,
                  searchEnabled: true,
                  valueExpr: 'claRol',
                  displayExpr: 'nombre',
                  placeholder: Translate('Usuarios.Agregar.SelectRol'),
                }}
              >
                <Label text={Translate("Usuarios.Agregar.SelectRolText")} />
              </Item>
            </Form>
            <FormGroup className="text-right">
              <Button
                id="btnUsersGuardar"
                text={Translate("Usuarios.Agregar.Save")}
                onClick={this.btnGuardarHandleSubmit}
              />
              <Button
                id="btnUsersCancelar"
                text={Translate("Usuarios.Agregar.Cancel")}
                onClick={this.btnCancelarHandle}
              />
            </FormGroup>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default UsuarioAlta;
