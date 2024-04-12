/* eslint-disable no-lonely-if */
import React from 'react';
import { Card, CardHeader, CardBody, Row, Col, CardTitle, Button, Spinner } from 'reactstrap';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { config } from '../../../utils/config';
import { callApi, callKrakenApi, languageInit, Translate } from '../../../utils/utils';
import FiltroArticulo from './FiltroArticulo';
import FiltroFechas from './FiltroFechas';
import FiltroPlanta from './FiltroPlanta';
import FiltroAgrupador from './FiltroAgrupador';
import notify from 'devextreme/ui/notify';

export default class Filtros extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      
      fechaInicio: new Date(),
      fechaFin: new Date(),
      claUbicOrig:-1,
      claUbicDest:-1,
      psAgrupacion: null,

      claOrganizacionFiltro: null,
      claNivelFiltro: null,
      pnClaAgrupadorOrganizacion: null,

      agrupadorArticulo: null,
      claOrganizacionFiltroO: null,
      claNivelFiltroO: null,
      claTipoArticuloO: null,
      claAgrupadorArticulo: null,

      selectedOrganizacion: null,
      selectedArticulo: null,

      pnAgrupador: null,
      pnAgrupadorArticulo: null,

      ubicaciones:[],
      showSpin: false,
    };

    this.props.getSelectedMeses(this.state.fechaInicio, this.state.fechaFin);
 
    this._controlArticulosOrganizacion = React.createRef();

    this.onChangeFechaInicio = this.onChangeFechaInicio.bind(this);
    this.onChangeFechaFin = this.onChangeFechaFin.bind(this);
    this.onChangeUbicOrig = this.onChangeUbicOrig.bind(this);
    this.onChangeUbicDest = this.onChangeUbicDest.bind(this);

    this.GetSelectedArticulo = this.GetSelectedArticulo.bind(this);
    this.getSelectedOrganizacion = this.getSelectedOrganizacion.bind(this);

    this.onChangeAgrupadoresArt = this.onChangeAgrupadoresArt.bind(this);
    this.onChangeAgrupadoresOrg = this.onChangeAgrupadoresOrg.bind(this);

    this.GetSelectedAgrupador = this.GetSelectedAgrupador.bind(this);

    
    this.onBtnBuscar = this.onBtnBuscar.bind(this);
    this.onBtnLimpiar = this.onBtnLimpiar.bind(this);

  }

  roundNumber(n){
    let value = ((Math.round(n * 100))/100).toFixed(2);
    if(value === 'NaN') value = '';
    return value;
  }

  customizeDataCellText(cellInfo){
    cellInfo.valueText = this.roundNumber(cellInfo.value);
    return cellInfo.valueText;
  }

  getUbicaciones() {
    // reactContext 3: se extrae el action setClienteInfo del contexto, este guardara la informacion del cliente
    const params = {
      Valor: '',
      Tipo: 1,
      IncluirTodosSN: 0,
    };

    callKrakenApi(8, 258, params, 1, (res) => {
      // this.setState({ dataUbicaciones: res.Result0 });
      this.setState({ ubicaciones: res.Result0 });
    });
  }

  lastDayOfMonth(d){
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  firstDayOfMonth(d){
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  onChangeFechaInicio(object) {
    const fechaInicio = this.firstDayOfMonth(object.value);
    this.setState({ fechaInicio });
    this.props.getSelectedMeses(this.state.fechaInicio, this.state.fechaFin);
  }

  onChangeFechaFin(object) {
    let fechaFin = new Date();
    if(object.value.getFullYear() === fechaFin.getFullYear() && object.value.getMonth() === fechaFin.getMonth()){
      this.setState({ fechaFin });
    }
    else{
      fechaFin = this.lastDayOfMonth(object.value);
      this.setState({ fechaFin });
    }
    this.props.getSelectedMeses(this.state.fechaInicio, this.state.fechaFin);
  }

  
  onChangeUbicOrig(selectedItem) {
    const claUbicOrig = selectedItem.value != null ? selectedItem.value : -1;

    this.setState({ claUbicOrig });
  }

  onChangeUbicDest(selectedItem) {
    const claUbicDest = selectedItem.value != null ? selectedItem.value : -1;

    this.setState({ claUbicDest });
  }

  getSelectedOrganizacion(e){
    console.log(e)
    
    if(e[0].key === 1 || e[0].key === "1"){
      this.setState({
        claOrganizacionFiltro: null,
        claNivelFiltro: null,
        pnClaAgrupadorOrganizacion:null,
        pnAgrupador: 0
      });
    }
    else{
      const arr = e[0].key.split("_");
      this.setState({
        claOrganizacionFiltro: arr[arr.length-1],
        claNivelFiltro: arr.length-1,
        pnClaAgrupadorOrganizacion:null,
        pnAgrupador: 0
      });
    }
  }

  GetSelectedArticulo(e){
    console.log(e)
    if(e[0].key === 1){
      this.setState({
        claOrganizacionFiltroO: null,
        claNivelFiltroO: null,
        claTipoArticuloO: null,
        pnAgrupadorArticulo: null,
      });
    }
    else{
      if(e[0].key.toString().includes("_") === true){
        const arr = e[0].key.split("_");
        if(arr.length > 1){
          this.setState({
            claTipoArticuloO: arr[1],
            pnAgrupadorArticulo: null
          });
        }
        if(arr.length > 2){
          this.setState({
            claOrganizacionFiltroO: arr[arr.length-1],
            claNivelFiltroO: arr.length-2,
            pnAgrupadorArticulo: null
          });
        }
      }
      else{
        this.setState({
          claOrganizacionFiltroO: e[0].key,
          claNivelFiltroO: 1,
          pnAgrupadorArticulo: null
        });
      }
    }
  }

  onChangeAgrupadoresArt(e){
    console.log(e);
    this.setState({
      claAgrupadorArticulo: e.value,
      pnAgrupadorArticulo: 1,
      claOrganizacionFiltroO:  null,
      claNivelFiltroO: null,
      claTipoArticuloO: null
    });
  }
  
  onChangeAgrupadoresOrg(e){
    this.setState({
      pnClaAgrupadorOrganizacion: e.value,
      claOrganizacionFiltro: null,
      claNivelFiltro: null,
      pnAgrupador: 1
    });

  }
  
  GetSelectedAgrupador(e){
    this.setState({
      selectedAgrupacion: e.value
    });
    const ids = []
    for(let i = 0; i < e.value.length;i++){
      const id = e.value[i];
      ids.push(id);
    }
    this.setState({psAgrupacion: ids.join(',')});

    console.log("Agrupacion:");
    console.log(this.state.selectedAgrupacion);
  }

  onBtnLimpiar() {

    const filtros = {
      fechaInicio: new Date(),
      fechaFin: new Date(),
      claUbicOrig:-1,
      claUbicDest:-1,
      claOrganizacionFiltro: null,
      claNivelFiltro: null,
      psAgrupacion: null,
      pnAgrupadorArticulo: null,
      pnClaAgrupadorOrganizacion: null,

      selectedOrganizacion: null,
      selectedArticulo: null,
    };
    this.props.onChange([], filtros);

    this._controlArticulosOrganizacion.current.clearAll();

    this.setState({
      fechaInicio: new Date(),
      fechaFin: new Date(),
      claUbicOrig:-1,
      claUbicDest:-1,
      psAgrupacion: null,

      claOrganizacionFiltro: null,
      claNivelFiltro: null,
      pnClaAgrupadorOrganizacion: null,

      agrupadorArticulo: null,
      claOrganizacionFiltroO: null,
      claNivelFiltroO: null,
      claTipoArticuloO: null,
      claAgrupadorArticulo: null,

      pnAgrupador: 0,
      pnAgrupadorArticulo: null,

      selectedAgrupacion: null,

      selectedOrganizacion: null,
      selectedArticulo: null,
    });
  }

  onBtnBuscar() {
    this.getPivot();
  }
  
  getPivot() {
    
    const urlApiService = `${config.UrlApiProject}POI/pivot`;
    
    const pad = function (num) { return (`0${num}`.slice(-2)); };
    const fechaFormat = function (fecha) {
      return (`${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`);
    };

    if(this.state.psAgrupacion === null || this.state.psAgrupacion === undefined || this.state.psAgrupacion === [] || this.state.psAgrupacion === ""){
      notify({
        message: 'Selecciona un agrupador',
        position: {
          my: 'center',
          at: 'center'
        }
      }, 'error', 3000);
      return;
    }

    const params = {
      FechaIni: fechaFormat(this.state.fechaInicio),
      FechaFin: fechaFormat(this.state.fechaFin),
      Agrupacion: this.state.psAgrupacion,

      // Organizacion
      ClaOrganizacionFiltro: this.state.claOrganizacionFiltro,
      ClaNivelFiltro: this.state.claNivelFiltro,
      ClaAgrupadorOrganizacion: this.state.claAgrupadorOrganizacion,
      Agrupador: this.state.pnAgrupador,

      // Articulo
      ClaOrganizacionFiltroO: this.state.claOrganizacionFiltroO,
      ClaNivelFiltroO: this.state.claNivelFiltroO,
      ClaTipoArticuloO: this.state.claTipoArticuloO,
      ClaAgrupadorArticulo: this.state.claAgrupadorArticulo,
      AgrupadorArticulo: this.state.pnAgrupadorArticulo,
      

      // Plantas
      UbicOrig: this.state.claUbicOrig,
      UbicDest: this.state.claUbicDest
    };


    this.setState({ showSpin: true });

    const self = this;
    
    callApi(urlApiService, 'POST', params, (result) => {
      this.props.onChange(result.data);
      this.setState({ showSpin: false });
    }); 
  }

  componentDidMount() {
    this.getUbicaciones();
  }

  render() {
    const spinner =
      this.state.showSpin === true ? (
        <Loader type="Puff" color="#00BFFF" height={40} width={40} />
      ) : (<></>);

    return (
      <>
        <div className="content">
          <Row>
            <Col md={12} style={{ padding: 0, margin: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{Translate("Pivot.Filtros")}</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={{ size: 12 }}>
                      <FiltroArticulo
                        Default={1}
                        selectedOrganizacion={this.state.selectedOrganizacion}
                        AgrupOrg={this.state.pnClaAgrupadorOrganizacion}
                        selectedArticulo={this.state.selectedArticulo}
                        AgrupArt={this.state.claAgrupadorArticulo}
                        GetSelectedOrganizacion={this.getSelectedOrganizacion}
                        GetSelectedArticulo={this.GetSelectedArticulo}
                        onChangeAgrupadoresArt={this.onChangeAgrupadoresArt}
                        onChangeAgrupadoresOrg={this.onChangeAgrupadoresOrg}
                        ref={this._controlArticulosOrganizacion}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6 }}>
                      <Row>
                        <Col md={{ size: 6 }}>
                          <FiltroPlanta 
                            data={this.state.ubicaciones}
                            claUbicOrig={this.state.claUbicOrig}
                            claUbicDest={this.state.claUbicDest}
                            onChangeUbicOrig={this.onChangeUbicOrig}
                            onChangeUbicDest={this.onChangeUbicDest}
                          >
                          </FiltroPlanta>
                        </Col>
                        <Col md={{ size: 6 }}>
                          <FiltroFechas
                            fechaInicio={this.state.fechaInicio}
                            fechaFin={this.state.fechaFin}
                            onChangeFechaInicio={this.onChangeFechaInicio}
                            onChangeFechaFin={this.onChangeFechaFin}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={{ size: 6 }}>                      
                      <FiltroAgrupador
                        GetSelectedAgrupador={this.GetSelectedAgrupador}
                        value={this.state.selectedAgrupacion}
                      >
                      </FiltroAgrupador>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 6 }}>
                      <Row>
                        <Col md={{ size: 4 }}>
                          <Button type="button" color="warning" onClick={this.onBtnBuscar}>
                            {Translate("Filtros.Buscar")}
                          </Button>
                          <Button
                            type="button"
                            className="btn btn-primario"
                            onClick={this.onBtnLimpiar}
                          >
                            {Translate("Filtros.Limpiar")}
                          </Button>
                        </Col>
                        {spinner}
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
