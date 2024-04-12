import React from 'react';
import { Popup } from 'devextreme-react/popup';
import { Route, Router, Redirect } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col } from 'reactstrap';
import DataGrid, {
  Column,
  Paging,
  Editing,
  Texts,
  Lookup,
  FilterRow,
  Scrolling,
} from 'devextreme-react/data-grid';
import { config } from '../../utils/config';
import { callApi, Translate } from '../../utils/utils';
import UsuarioAlta from './UsuarioAlta';

import POI from '../POI/POI.js';

export default class Responsables extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usuarios: [],
      roles: [],
      popupVisible: false,
    };

    this.onClickAgregar = this.onClickAgregar.bind(this);
    this.hidePopUp = this.hidePopUp.bind(this);
    this.handler = this.handler.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.updateUsuario = this.updateUsuario.bind(this);
    this.onRowRemoved = this.onRowRemoved.bind(this);
  }

  /**
   * Funcion que se abre el popup para dar de alta un usuario
   * @param {Obj} e objeto del popup
   */
  onClickAgregar(e) {
    this.setState({
      popupVisible: true,
    });

    e.stopPropagation();
  }

  /**
   * Funcion que se oculta el popup de alta de usuario
   */
  hidePopUp() {
    this.setState({
      popupVisible: false,
    });
  }

  /**
   * Funcion que actualiza el estatus del popup de alta de usuario
   * @param {Boolean} val estatus del popop
   */
  handler(val) {
    this.setState({
      popupVisible: val,
    });
  }

  /**
   * Funcion que obtiene los roles
   */
  getRoles() {
    const urlApiService = `${config.UrlApiProject}usuario/roles`;

    callApi(urlApiService, 'GET', null, (result) => {
      this.setState({
        roles: result.data,
      });
    });
  }

  /**
   * Funcion que obtiene los usuarios dados de alta
   */
  getUsuarios() {
    const urlApiService = `${config.UrlApiProject}usuario/obtener/0`;

    callApi(urlApiService, 'GET', null, (result) => {
      this.setState({
        usuarios: result.data,
      });
    });
  }

  /**
   * Funcion que actualiza el usuario del grid
   */
  onRowUpdated(objeto) {
    this.updateUsuario(objeto);
  }

  /**
   * Funcion que elimina un usuario del grid
   */
  onRowRemoved(objeto) {
    this.updateUsuario(objeto, true);
  }

  /**
   * Funcion que realiza la peticion al servicio
   */
  updateUsuario(objeto, eliminar) {
    if (objeto.data) {
      const urlApiService = `${config.UrlApiProject}usuario/actualizar`;

      // Parametros o cuerpo del servicio
      const body = {
        ClaUsuario: objeto.data.claUsuario,
        BajaLogica: eliminar ? 1 : 0,
        ClaRol: objeto.data.claRol,
      };

      callApi(urlApiService, 'POST', body, (result) => {
        this.getUsuarios();
      });
    }
  }

  componentDidMount() {
    this.getRoles();
    this.getUsuarios();
  }

  render() {
    let GridUsuarios = (<></>);
    callApi(`${config.UrlApiProject}usuario/permisos`, 'POST', {}, (result) => {
      if(!result.data.includes("permisos"))
      {
        GridUsuarios = (
          <>
            <Router history={this.props.history}>
              <Route path="/" component={POI} />
              <Redirect from="/" to={POI} />
            </Router>
          </>
        )
      }
    });
    GridUsuarios = (
      <DataGrid
        dataSource={this.state.usuarios}
        showRowLines={true}
        onRowUpdated={this.onRowUpdated}
        onRowRemoved={this.onRowRemoved}
        noDataText={Translate("Usuarios.Grid.NoData")}
        className="col-12"
      >
        <Scrolling showScrollbar="never" />
        <FilterRow visible={true} showAllText={Translate("Usuarios.Grid.SearchRoles")} />
        <Paging defaultPageSize={20} />
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={false}
          width={100}
        >
          <Texts confirmDeleteMessage={Translate("Usuarios.Grid.ConfirmDelete")} />
        </Editing>
        <Column
          dataField="claUsuario"
          caption="Clave Usuario"
          allowEditing={false}
          alignment="center"
          visible={false}
          width={200}
        />
        <Column
          dataField="claEmpleado"
          caption={Translate("Usuarios.Grid.ClaEmpleado")}
          allowEditing={false}
          alignment="center"
          width={200}
        />
        <Column dataField="nombre" caption={Translate("Usuarios.Grid.Nombre")} allowEditing={false} width={500} />

        <Column dataField="claRol" caption={Translate("Usuarios.Grid.Rol")} width={300}>
          <Lookup dataSource={this.state.roles} displayExpr="nombre" valueExpr="claRol" />
        </Column>
      </DataGrid>
    );

    const GridUsuariosServicio = () => {
      return <div>{GridUsuarios}</div>;
    };

    return (
      <>
        <div className="content">
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <CardTitle tag="h4">{Translate("Usuarios.Title.Title")}</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={{ size: 1, offset: 11 }} style={{ textAlign: 'center' }}>
                  <Button
                    id="btnNuevo"
                    onClick={this.onClickAgregar}
                    size="md"
                    className="btn btn-primary btn-round btn-icon btn-custom mb-1"
                  >
                    <i className="fa fa-plus" />
                  </Button>
                </Col>
              </Row>
              <GridUsuariosServicio />
            </CardBody>
          </Card>
        </div>

        <Popup
          key="popUpUsuarios"
          id="popUpUsuarios"
          visible={this.state.popupVisible}
          onHiding={this.hidePopUp}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showTitle={true}
          title={Translate("Usuarios.Agregar.Title")}
          width={470}
          height={570}
        >
          <UsuarioAlta handler={this.handler} roles={this.state.roles} />
        </Popup>
      </>
    );
  }
}
