/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-debugger */
/* eslint-disable prefer-const */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import React from 'react';
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import { config } from '../../../utils/config';
import { callApi2, callKrakenApi, Translate } from '../../../utils/utils';
import CtrlTreeViewComboBox from 'components/Controls/CtrlTreeviewComboBox';
import CtrlArticulosTreView from 'components/Controls/CtrlArticulosTreView';
import CtrlComboBox from './CtrlComboBox';
import TreeView from 'devextreme-react/tree-view';
import { Button } from 'devextreme-react/button';
import Organizaciones from '../../Organizaciones/Organizaciones.js';
import Agrupacion from '../../Articulos/Agrupacion.js';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import ScrollView from 'devextreme-react/scroll-view';

const testData = [{id: 1, text: "TODOS", hasItems: 0}]

export default class FiltroArticulo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceArt: [],
      sourceOrg: [],
      popupType: -1,
      popupOrgVisible: false,
      popupArtVisible: false,
      btnOrgVisible: false,
      btnArtVisible: false
    };

    this._cmbOrganizaciones = React.createRef();
    this._cmbArticulos = React.createRef();
    this._cmbAgrupadorOrganizacion = React.createRef();
    this._cmbAgrupadorArticulos = React.createRef();
    
    this.GetSelectedArticulo = this.GetSelectedArticulo.bind(this);
    this.GetSelectedOrganizacion = this.GetSelectedOrganizacion.bind(this);

    this.onChangeAgrupadoresArt = this.onChangeAgrupadoresArt.bind(this);
    this.onChangeAgrupadoresOrg = this.onChangeAgrupadoresOrg.bind(this);

    this.hideInfoOrg = this.hideInfoOrg.bind(this);
    this.hideInfoArt = this.hideInfoArt.bind(this);


    this.closeButtonOptionsOrg = {
      text: 'Close',
      onClick: this.hideInfoOrg
    };
    this.closeButtonOptionsArt = {
      text: 'Close',
      onClick: this.hideInfoArt
    };
  }  

  clearOrganizaciones(){
    this._cmbOrganizaciones.current.clear();
  }

  clearArticulos(){
    this._cmbArticulos.current.clear();
  }

  clearAgrupadorOrganizaciones(){
    this._cmbAgrupadorArticulos.current.value = null;
  }

  clearAgrupadorArticulos(){
    this._cmbAgrupadorArticulos.current.value = null;
  }

  clearAll(){
    this.clearAgrupadorArticulos();
    this.clearAgrupadorOrganizaciones();
    this.clearArticulos();
    this.clearOrganizaciones();
  }

  GetSelectedOrganizacion =(e) => {
    this.props.GetSelectedOrganizacion(e);
    this.clearAgrupadorOrganizaciones();
  }

  GetSelectedArticulo =(e) => {
    this.props.GetSelectedArticulo(e);
    this.clearAgrupadorArticulos();
  }

  onChangeAgrupadoresArt =(e) => {
    this.clearArticulos();
    this.props.onChangeAgrupadoresArt(e);
  }

  onChangeAgrupadoresOrg =(e) => {
    this.clearOrganizaciones();
    this.props.onChangeAgrupadoresOrg(e);
  }
  
  getDataOrganizacion(){
    // const urlApiService = `${config.UrlApiProject}POI/getorganizacionesbynivel?nivel=0`;

    // callApi(`${urlApiService}`, 'GET', {}, (result) => {
    //   console.log(result.data);
    //   this.setState({
    //     sourceOrg: result.data,
    //     // dropDwonText: result.data.text
    //   });
    // });
  }
  
  getDataArticulosAgrupador(){
    const urlApiService = `${config.UrlApiProject}agrupador/agrupadores`;

    callApi2(urlApiService, 'GET', {}).then( (result) => {
        this.setState({
            agrupacionDataSource: result.data
        });
    });
  }
  
  getDataOrganizacionAgrupador(){
    const urlApiService = `${config.UrlApiProject}poi/getagrupadoresorganizaciones`;

    callApi2(urlApiService, 'POST', {}).then( (result) => {
        this.setState({
          agrupacionOrganizacionesDataSource: result.data[0]
        });
    });
  }
  
  getDataArticulo(){
    // const urlApiService = `${config.UrlApiProject}articulo/articulos`;

    // callApi(`${urlApiService}`, 'GET', {}, (result) => {
    //   this.setState({
    //     sourceArt: result.data
    //   });
    // });
  }

  onChangeCmbArticulos(e) {
    this.setState({
      treeBoxValue: e.component.getSelectedNodeKeys()
    });
  }

  async createChildren(parent){
    let parentId = parent ? parent.itemData.id : 0;
    let nivel = parent ? parent.itemData.nivel : 0;

    console.log(parent ? parent.itemData.direcciones : "none");

    const urlApiService = `${config.UrlApiProject}POI/getorganizacionesbynivel?nivel=${nivel}&parentid=${parentId}`;

    var newdata = null;
    
    var asyncC = await callApi2(`${urlApiService}`, 'GET', {}).then((result) => {
      newdata = result.data;
    });
    
    return newdata;
  }

  popupOrganizacionOnClick = e =>{
    this.setState({
      popupOrgVisible: true,
      popupArtVisible: false
    });
  }

  popupArticuloOnClick = e =>{    
    this.setState({
      popupOrgVisible: false,
      popupArtVisible: true
    });
  }

  hideInfoOrg() {
    this.setState({
      popupOrgVisible: false,
    });
  }

  hideInfoArt() {
    this.setState({
      popupArtVisible: false,
    });
  }

  componentDidMount() {  
    this.getDataArticulo();
    this.getDataOrganizacion();

    this.getDataArticulosAgrupador();
    this.getDataOrganizacionAgrupador();

    callApi2(`${config.UrlApiProject}usuario/permisos`, 'POST', {}).then( (result) => {
      
      if(result.data.includes("Articulos"))
      {
        this.setState({
          btnArtVisible: true
        });
      }
      
      if(result.data.includes("Organizaciones"))
      {
        this.setState({
          btnOrgVisible: true
        });
      }
    });
  }

  componentWillUnmount(){
  }

  render() {
    return (
      <>
        <Row>
          <Col md={{size: 6}} style={{ padding: 0, margin: 0 }}>
            <div className="row m-0 p-0 mb-1 align-items-center">
              <Col md={{ size: 12 }}>
                <Row style={{ height: 24 }}>
                  <Col md={{ size: 12 }}>
                    <div className="pl-xl-2 subtitle-1">{Translate("Filtros.Organizacion")}</div>
                  </Col>
                </Row>
                <Row style={{ height: 32 }}>
                  <Col md={{ size: 10 }}>
                    <CtrlTreeViewComboBox 
                      blockedLevels={[0]}
                      value={this.props.selectedOrganizacion}
                      dataSource={this.state.sourceOrg}
                      Default={1}
                      onTreeViewCallback={this.GetSelectedOrganizacion}
                      selectionMode="single"
                      checkBoxesMode="none"
                      ref={this._cmbOrganizaciones}
                      demand={true}
                      createChildren={this.createChildren}
                    >
                    </CtrlTreeViewComboBox>
                  </Col>
                  <Col md={{ size: 2 }}>
                    { this.state.btnOrgVisible === true ? (
                    <Button 
                      text={Translate("BtnPopupOrg.Text")} 
                      onClick={this.popupOrganizacionOnClick}
                    />
                  ):
                    null}
                  </Col>
                </Row>
              </Col>
            </div>
          </Col>
          <Col md={{size: 6}} style={{ padding: 0, margin: 0 }}>
            <div className="row m-0 p-0 mb-1 align-items-center">
              <Col md={{ size: 12 }}>
                <Row style={{ height: 24 }}>
                  <Col md={{ size: 12 }}>
                    <div className="pl-xl-2 subtitle-1">{Translate("Filtros.Articulos")}</div>
                  </Col>
                </Row>
                <Row style={{ height: 32 }}>
                  <Col md={{ size: 10 }}>
                    <CtrlArticulosTreView
                      onTreeViewCallback={this.GetSelectedArticulo}
                      ref={this._cmbArticulos}
                    >
                    </CtrlArticulosTreView>
                  </Col>
                  <Col md={{ size: 2 }}>
                    { this.state.btnArtVisible === true ?
                      (
                      <Button 
                        text={Translate("BtnPopupArt.Text")} 
                        onClick={this.popupArticuloOnClick}
                      />
                      ):
                      null}                
                  </Col>
                </Row>
              </Col>
            </div>
          </Col>
        </Row>
        <Row style={{ marginleft: 0, marginright: 0 }}>
          <Col md={{ size: 6 }} style={{ padding: 0, margin: 0 }}>
            <CtrlComboBox
              etiqueta={Translate("Filtros.AgrupadorOrg")}
              valueExpr="ClaAgrupadorOrganizacion"
              displayExpr="NomAgrupadorOrganizacion"
              value={this.props.AgrupOrg}
              data={this.state.agrupacionOrganizacionesDataSource}
              onChange={this.onChangeAgrupadoresOrg}
              placeholder={Translate("Filtros.PlaceholderDefault")}
              ref={this._cmbAgrupadorOrganizacion}
            />
          </Col>
          <Col md={{ size: 6 }} style={{ padding: 0, margin: 0 }}>
            <CtrlComboBox
              etiqueta={Translate("Filtros.AgrupadorArt")}
              valueExpr="claAgrupadorOrganizacion"
              displayExpr="nomAgrupadorOrganizacion"
              value={this.props.AgrupArt}
              data={this.state.agrupacionDataSource}
              onChange={this.onChangeAgrupadoresArt}
              placeholder={Translate("Filtros.PlaceholderDefault")}
              ref={this._cmbAgrupadorArticulos}
            />
          </Col>    
        </Row>
        <Popup
          visible={this.state.popupOrgVisible}
          onHiding={this.hideInfoOrg}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showCloseButton={true}
          showTitle={true}
          title={Translate("Popup.Organizaciones.Title")}
          container=".dx-viewport"
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={this.closeButtonOptionsOrg}
          />
          <ScrollView width='100%' height='100%'>
              <Organizaciones>
              </Organizaciones>
          </ScrollView>
        </Popup>
        <Popup
          visible={this.state.popupArtVisible}
          onHiding={this.hideInfoArt}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showCloseButton={true}
          showTitle={true}
          title={Translate("Popup.Articulos.Title")}
          container=".dx-viewport"
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={this.closeButtonOptionsArt}
          />
          <ScrollView width='100%' height='100%'>
            <Agrupacion>
            </Agrupacion>
          </ScrollView>
        </Popup>
      </>
    );
  }
}