/* eslint-disable radix */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-debugger */
import React from 'react';
import { config } from '../../utils/config';
import OrganizacionesGrid from './OrganizacionesGrid.js';
import AgrupadoresGrid from './AgrupadoresGrid.js';
import FiltrosOrganizaciones from './FiltrosOrganizaciones.js';
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import { callApi, setSessionData, getSessionItem, Translate } from '../../utils/utils';
import CtrlTreeViewComboBox from 'components/Controls/CtrlTreeviewComboBox';
import { Button } from 'devextreme-react/button';

export default class Organizaciones extends React.Component {
  constructor(props){
    super(props);

    this._isMounted = false;

    this.state = {
      agrupadoresDataSource: [],
      ctrlOrganizaciones: [],
      organizacionesDataSource: [],
      claveAgrupador: "",
      descripcionAgrupador: "",
      selectedNivel: -1,
      agregarDisabled: true
    };
  }

  onAgrupadorRowDblClick = e => {
    const urlApiService = `${config.UrlApiProject}`;

    this.setState(
      {
        claveAgrupador: e.values[1],
        descripcionAgrupador: e.values[2],
        agregarDisabled: false
      }
    );

    callApi(`${urlApiService}organizaciones/agrupadoresorganizaciones?id=${e.values[1]}`, 'GET', {}, (result) => {
      this.setState({
        organizacionesDataSource: result.data,
      });
    });
  }

  onAgrupadorRowUpdated = e => {
    const {oldData} = e;

    Object.keys(e.newData).forEach((element,index) => {
      oldData[element] = e.newData[element]  
      }
    )
    
    const newData = {
      "ClaAgrupadorOrganizacion" : oldData.ClaAgrupadorOrganizacion,
      "NomAgrupadorOrganizacion" : oldData.NomAgrupadorOrganizacion,
      "BajaLogica" : oldData.BajaLogica
    }

    const urlApiService = `${config.UrlApiProject}organizaciones/`;

    callApi(`${urlApiService}updateagrupador`, 'PUT', newData, (result) => {
      this.setState({
        agrupacionDataSource: result.data,
      });
    }); 
  }

  onAgrupadorRowInserted = e => {
    const urlApiService = `${config.UrlApiProject}`;

    const data = {
      "ClaAgrupadorOrganizacion" : e.data.claAgrupadorOrganizacion === undefined ? 0 : e.data.ClaAgrupadorOrganizacion,
      "NomAgrupadorOrganizacion" : e.data.NomAgrupadorOrganizacion,
      "BajaLogica" : e.data.BajaLogica === undefined ? 0 : e.data.BajaLogica
    }
    
    callApi(`${urlApiService}organizaciones/insertagrupador`, 'POST', [data], (result) => {
      this.setState({
        agrupadoresDataSource: result.data
      });
    });
  }

  onOrganizacionRowdUpdated = e =>{
    const {oldData} = e;

    Object.keys(e.newData).forEach((element,index) => {
      oldData[element] = e.newData[element]  
      }
    )
    
    const newData = {
      "ClaNivelFiltro" : oldData.ClaNivelFiltro,
      "ClaAgrupadorOrganizacion" : oldData.ClaAgrupadorOrganizacion,
      "NomOrganizacion" : oldData.NomOrganizacion,
      "ClaOrganizacion": oldData.ClaOrganizacion,
      "BajaLogica" : oldData.BajaLogica
    }

    const urlApiService = `${config.UrlApiProject}`;

    callApi(`${urlApiService}organizaciones/agrupadoresorganizaciones`, 'PUT', newData, (result) => {
      this.setState({
        organizacionesDataSource: result.data
      });
    });
  }

  async createChildren(parent){
    const parentId = parent ? parent.itemData.id : 0;
    const nivel = parent ? parent.itemData.nivel : 0;
    
    const urlApiService = `${config.UrlApiProject}POI/getorganizacionesbynivel?nivel=${nivel}&parentid=${parentId}`;

    var newdata = null;
    
    var asyncC = await callApi(`${urlApiService}`, 'GET', {}, (result) => {
      newdata = result.data;
    });
    
    return newdata;
  }

  getSelectedOrganizacion = e =>{
    console.log(e)
    this.setState({
      selectedItemOrganizacion: e[0].itemData,
      
    });
  }
  
  agregarArticuloOnClick = (e) =>{
    console.log(this.state.selectedItemOrganizacion)

    const newData = {
      "ClaAgrupadorOrganizacion": this.state.claveAgrupador,
      "NomAgrupadorOrganizacion": this.state.descripcionAgrupador,
      "NomOrganizacion": this.state.selectedItemOrganizacion.text,
      "ClaOrganizacion": Number.isInteger(this.state.selectedItemOrganizacion.id) ? 
          this.state.selectedItemOrganizacion.id : parseInt(this.state.selectedItemOrganizacion.id.split('_').length === 3 ? 
              this.state.selectedItemOrganizacion.id.split('_')[2] : this.state.selectedItemOrganizacion.id.split('_')[3]),
      "ClaNivel": parseInt(this.state.selectedItemOrganizacion.id.split('_').length) - 1,
      
    }

    this.setState(prevState => ({
      organizacionesDataSource: [...prevState.organizacionesDataSource, newData]
    }))

    this.setState({
      itemToSave: newData
    });
  }

  guardarAgrupacionArticulosOnClick = (e) =>{
    console.log(this.state.itemToSave);

    const urlApiService = `${config.UrlApiProject}`;

    callApi(`${urlApiService}organizaciones/agrupadoresorganizaciones`, 'POST', this.state.itemToSave, (result) => {
      this.setState({
        organizacionesDataSource: result.data
      });
    });
  }
  
  componentDidMount(){
    this._isMounted = true;

    const urlApiService = `${config.UrlApiProject}`;

    callApi(`${urlApiService}organizaciones/agrupadores`, 'GET', {}, (result) => {
      this.setState({
        agrupadoresDataSource: result.data
      });
    });
  }

  componentWillUnmount(){
    
  }
 
  render(){
    return (
      <>
        <div className="content">
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  <CardTitle tag="h4">{Translate('Organizaciones.Header.Title')}</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={{ size: 2 }} style={{ textAlign: 'center' }}>
                  <div>{Translate('Organizaciones.Header.ClaveAgrupador')}:</div><div>{this.state.claveAgrupador}</div>
                </Col>
                <Col md={{ size: 2 }} style={{ textAlign: 'center' }}>
                  <div>{Translate('Organizaciones.Header.Descripcion')}:</div><div>{this.state.descripcionAgrupador}</div>
                </Col>
                <Col md={{ size: 6 }} style={{ textAlign: 'center' }}>
                  {/* <div>{Translate('Organizaciones.TreeSelectArticulos.Title')}</div> */}
                  <CtrlTreeViewComboBox 
                    blockedLevels={[2]}
                    // dataSource={this.state.sourceOrg}
                    Default={1}
                    onTreeViewCallback={this.getSelectedOrganizacion}
                    selectionMode="single"
                    checkBoxesMode="none"
                    ref={this.cmbOrganizaciones}
                    demand={true}
                    createChildren={this.createChildren}
                  >
                  </CtrlTreeViewComboBox>
                </Col>
                <Col md={{ size: 2 }}>
                  <Button 
                    text={Translate("Organizaciones.BtnAgregar.Text")} 
                    onClick={this.agregarArticuloOnClick} 
                    disabled={this.state.agregarDisabled} 
                  />
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 2, offset: 10 }}>
                  <Button className="mb-2" disabled={false} text={Translate("Organizaciones.BtnGuardar.Text")} onClick={this.guardarAgrupacionArticulosOnClick} />
                </Col>
              </Row>
              <Row>
                <Col md={{ size: 6 }} style={{ textAlign: 'center' }}>
                  <AgrupadoresGrid
                    dataSource={this.state.agrupadoresDataSource}
                    onRowDblClick={this.onAgrupadorRowDblClick}
                    onRowInserted={this.onAgrupadorRowInserted}
                    onRowUpdated={this.onAgrupadorRowUpdated}
                  />
                </Col>
                <Col md={{ size: 6 }} style={{ textAlign: 'center' }}>
                  <OrganizacionesGrid
                    dataSource={this.state.organizacionesDataSource}
                    onRowUpdated={this.onOrganizacionRowdUpdated}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </>        
    )
  }
}