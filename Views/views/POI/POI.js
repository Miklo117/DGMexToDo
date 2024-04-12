/* eslint-disable no-else-return */
/* eslint-disable no-lonely-if */
/* eslint-disable eqeqeq */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import React from 'react';
import AppContext from '../../context/AppContext';

import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import { locale } from 'devextreme/localization';

import Filtros from './Filtros/Filtros';
import POITreeList from './POITreeList';
import ScrollView from 'devextreme-react/scroll-view';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { config } from '../../utils/config';
import { callApi, callKrakenApi, Translate } from '../../utils/utils';
import CalidadEntregaDG from './DetailGrids/CalidadEntregaDG';
import CalidadFacturaDG from './DetailGrids/CalidadFacturaDG';
import CumplimientoOfertaDG from './DetailGrids/CumpOfertaDG';
import NoStockoutDG from './DetailGrids/NoStockoutDG';
import VencidosDG from './DetailGrids/VencidosDG';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

class POI extends React.Component {
  constructor(props) {
    super(props);

    this._filtros = React.createRef();
    this._treeView = React.createRef();
    this._CumplimientoOfertaDG = React.createRef();
    this._CalidadEntregaDG = React.createRef();
    this._CalidadFacturaDG = React.createRef();
    this._NoStockoutDG = React.createRef();
    this._detailGridVencidos = React.createRef();

    locale('en');
    const filtros = {
      claDireccion: -1,
      claSubdireccion: -1,
      claZona: -1,
      claAgente: -1,
      claPlanta: -1,
      claFamilia: -1,
      claSubfamilia: -1,
      claProducto: -1,
      claCliente: -1,
      numPedido: null,
      tipoFecha: 1,
      fechaInicio: new Date(),
      fechaFin: new Date(),
      pendienteFechaPromesa: false,
      canceladosSurtidos: false,
      pedidoVencidos: false,
    };

    this.state = {
      buscador: true,
      dataPivot: [],
      filtros,
      claPedido: 0,
      pageIndex: 0,
      popupVisible: false,
      showVencido: false,
      dataDetailVencido: [],
      mesIncluded: null,
    };

    this.onChangePedidos = this.onChangePedidos.bind(this);
    this.onClickPedido = this.onClickPedido.bind(this);
    this.onGridPage = this.onGridPage.bind(this);
    this.onBackDetalle = this.onBackDetalle.bind(this);
    this.getSelectedMeses = this.getSelectedMeses.bind(this);

    this.onPOICellClick = this.onPOICellClick.bind(this);

    this.hideInfo = this.hideInfo.bind(this);

    this.closeButtonOptions = {
      text: 'Close',
      onClick: this.hideInfo,
    };
  }

  hideInfo() {
    this.setState({
      detailTitle: '',
      showVencido: false,
      dataDetail: [],
      dataDetailVencido: [],
      NoStockoutDGVisible: false,
      CalidadEntregaDGVisible: false,
      CalidadFacturaDGVisible: false,
      CumplimientoOfertaDGVisible: false,
    });
  }

  onPOICellClick(e) {
    let DetailTitleAppend = '';
    if (e.column.dataField === 'descripcion') {
      e.cancel = true;
      return;
    }

    // const clicked = e.data.claFecha[e.cell.dataIndex].areaIndex;
    // if(e.cell.columnPath[1] < 10)
    //   ClaAnioMesF = `${e.cell.columnPath[0]}0${e.cell.columnPath[1]}`;
    // else
    //   //if string
    //   if(isNaN(e.cell.columnPath[0]) === true){
    //     ClaAnioMesF = 13
    //   }
    //   else{
    //     ClaAnioMesF = `${e.cell.columnPath[0]}${e.cell.columnPath[1]}`;
    //   }

    // var nivelKeyF = 1;
    // const data=this.state.dataPivot;
    // let keys = null;
    // //IF grand total OR month 13
    // if(ClaAnioMesF === 13){
    //   keys = data
    //   .filter((item) => item.descripcion === e.cell.rowPath[0])[0];
    // }
    // else{
    //   // if(e.cell.rowPath[0] != "TotalEmpresa"){
    //     keys = data
    //     .filter((item) => (item.descripcion === e.cell.rowPath[0]) && item.claFecha===ClaAnioMesF)[0];
    //   // }
    //   // else{
    //   //   keys = data
    //   //   .filter((item) => item.descripcion === "TotalEmpresa")[0];
    //   //   nivelKeyF = 0;
    //   // }
    // }
    // if(keys === undefined) {
    //   if(e.cell.rowType === "GT"){
    //     keys = data
    //     .filter((item) => (item.claFecha===ClaAnioMesF))[0];
    //     nivelKeyF = 0;
    //   }
    //   else return;
    // }

    const ClaAnioMesF = e.data.claFecha < 1000 ? 13 : e.data.claFecha;
    const nivelKeyF = e.data.nivel;

    // DetailTitleAppend += ` ${e.column.caption}`;
    DetailTitleAppend += ` ${Translate(`Months`)[e.data.mes - 1]}`;
    // if(keys.descripcion !== null && keys.descripcion !== undefined){
    //   if(e.cell.rowType === "GT"){
    //     DetailTitleAppend += ` Grand Total`;
    //   }
    //   else{
    //     DetailTitleAppend += ` ${keys.descripcion}`;
    //   }
    // }

    const pad = function (num) {
      return `0${num}`.slice(-2);
    };
    const fechaFormatFin = function (fecha) {
      return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
    };
    const fechaFormatInicio = function (fecha) {
      if (ClaAnioMesF != 13) return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-01`;
      else return `${fecha.getFullYear()}-01-01`;
    };

    const params = {
      FechaIni: fechaFormatInicio(this._filtros.current.state.fechaInicio),
      FechaFin: fechaFormatFin(this._filtros.current.state.fechaFin),
      AgrupadorArticulo: this._filtros.current.state.agrupadorArticulo,
      Agrupacion: this._filtros.current.state.psAgrupacion,

      // Organizacion
      ClaOrganizacionFiltro: this._filtros.current.state.claOrganizacionFiltro,
      ClaNivelFiltro: this._filtros.current.state.claNivelFiltro,
      Agrupador: 0,
      // ClaAgrupadorOrganizacion: this._filtros.current.state.claAgrupadorOrganizacion,
      ClaAgrupadorOrganizacion: null,

      // Articulo
      ClaOrganizacionFiltroO: this._filtros.current.state.claOrganizacionFiltroO,
      ClaNivelFiltroO: this._filtros.current.state.claNivelFiltroO,
      ClaTipoArticuloO: this._filtros.current.state.claTipoArticuloO,
      // ClaAgrupadorArticulo: this._filtros.current.state.claAgrupadorArticulo,
      ClaAgrupadorArticulo: null,

      // Plantas
      ClaPlanta: this._filtros.current.state.claUbicOrig,
      ClaPlantaDestino: this._filtros.current.state.claUbicDest,

      ClaAnioMesF,
      NivelKeyF: nivelKeyF,
      Key0F: e.data.key0,
      Key1F: e.data.key1,
      Key2F: e.data.key2,
      Key3F: e.data.key3,
      Key4F: e.data.key4,
      Key5F: e.data.key5,
      Key6F: e.data.key6,
    };

    this.hideInfo();
    switch (e.column.dataField) {
      case 'noStockout':
        this.setState({
          detailTitle: `${Translate('Detail.Detalle')}: ${Translate(
            'Detail.NoStockout'
          )} ${DetailTitleAppend}`,
        });
        this.setState({ NoStockoutDGVisible: true });
        this._NoStockoutDG.current.setState({ showSpin: true });
        this.getNoStockoutDetail(params);
        break;
      case 'calidadEntrega':
        this.setState({
          detailTitle: `${Translate('Detail.Detalle')}: ${Translate(
            'Detail.CalidadEntrega'
          )} ${DetailTitleAppend}`,
        });
        this.setState({ CalidadEntregaDGVisible: true });
        this._CalidadEntregaDG.current.setState({ showSpin: true });
        this.getCalidadEntregaDetail(params);
        break;
      case 'cumplimientoOferta':
        this.setState({
          detailTitle: `${Translate('Detail.Detalle')}: ${Translate(
            'Detail.CumplimientoOferta'
          )} ${DetailTitleAppend}`,
        });
        this.setState({ CumplimientoOfertaDGVisible: true });
        this.getCumplimientoOfertaDetail(params);
        this._CumplimientoOfertaDG.current.setState({ showSpin: true });
        break;
      case 'calidadFactura':
        this.setState({
          detailTitle: `${Translate('Detail.Detalle')}: ${Translate(
            'Detail.CalidaDeFactura'
          )} ${DetailTitleAppend}`,
        });
        this.setState({ CalidadFacturaDGVisible: true });
        this.getCalidaDeFacturaDetail(params);
        this._CalidadFacturaDG.current.setState({ showSpin: true });
        break;
      default:
        console.log(clicked);
        break;
    }
  }

  getCumplimientoOfertaDetail(params) {
    const urlApiService = `${config.UrlApiProject}POI/getcumplimientoofertadetail`;

    callApi(urlApiService, 'POST', params, (result) => {
      this.setState({
        dataDetail: result.data[0],
        summaryTitle: `${Translate('Detail.Cumple')} ${Translate('Detail.CumplimientoOferta')}`,
      });
      this._CumplimientoOfertaDG.current.setState({ showSpin: false });

      this._detailGridVencidos.current.setState({ showSpin: true });
      const urlApiServiceVencidos = `${config.UrlApiProject}POI/getvencidosdetail`;
      callApi(urlApiServiceVencidos, 'POST', params, (result) => {
        // console.log(JSON.stringify(result.data[0]));
        this.setState({ dataDetailVencido: result.data[0], showVencido: true });
        this._detailGridVencidos.current.setState({ showSpin: false });
      });
    });
  }

  getNoStockoutDetail(params) {
    const urlApiService = `${config.UrlApiProject}POI/getNoStockoutDetail`;

    callApi(urlApiService, 'POST', params, (result) => {
      this.setState({
        dataDetail: result.data[0],
        summaryTitle: `${Translate('Detail.Cumple')} Line Fill Rate`,
      });
      this._NoStockoutDG.current.setState({ showSpin: false });
    });
  }

  getCalidadEntregaDetail(params) {
    const urlApiService = `${config.UrlApiProject}POI/getcalidadentregadetail`;

    callApi(urlApiService, 'POST', params, (result) => {
      // console.log(JSON.stringify(result.data[0]));
      this.setState({
        dataDetail: result.data[0],
        summaryTitle: `${Translate('Detail.Cumple')} ${Translate('Detail.CalidadEntrega')}`,
      });
      this._CalidadEntregaDG.current.setState({ showSpin: false });
    });
  }

  getCalidaDeFacturaDetail(params) {
    const urlApiService = `${config.UrlApiProject}POI/getcalidadefacturadetail`;

    callApi(urlApiService, 'POST', params, (result) => {
      this.setState({
        dataDetail: result.data[0],
        summaryTitle: `${Translate('Detail.Cumple')} ${Translate('Detail.CalidaDeFactura')}`,
      });
      this._CalidadFacturaDG.current.setState({ showSpin: false });
    });
  }

  getSelectedMeses(fechainicio, fechafin) {
    var mesRange = [13];
    for (var mesIndex = fechainicio.getMonth(); mesIndex <= fechafin.getMonth(); mesIndex++) {
      mesRange.push(mesIndex + 1);
    }
    mesRange.push(13);
    this.setState({ mesIncluded: mesRange });
    // return mesRange;
    // this._mesIncluded.current.mesIncluded = mesRange;
  }

  onChangePedidos(data) {
    this.setState({ dataPivot: data });
    this._treeView.current.setState({
      treeData: this.state.dataPivot,
    });
    console.log(this.state.dataPivot);
  }

  onClickPedido(ClaPedido) {
    this.setState({ buscador: false, claPedido: ClaPedido });
  }

  onGridPage(pageIndex) {
    this.setState({ pageIndex });
  }

  onBackDetalle() {
    this.setState({ buscador: true });
  }

  componentDidMount() {}

  render() {
    const { state } = this.context;
    const idPedidoParam = state.idPedido;
    let idPedido = this.state.claPedido;

    if (idPedidoParam !== null) idPedido = parseInt(idPedidoParam, 10);
    const buscadorContent = (
      <>
        <Row>
          <Col md={12}>
            <Filtros
              onChange={this.onChangePedidos}
              filtros={this.state.filtros}
              ref={this._filtros}
              getSelectedMeses={this.getSelectedMeses}
            />
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 12, offset: 0 }}>
            <POITreeList
              dataSource={this.state.dataPivot}
              ref={this._treeView}
              onCellClick={this.onPOICellClick}
            />
          </Col>
        </Row>

        {/* Cumplimiento Oferta */}
        <Popup
          visible={this.state.CumplimientoOfertaDGVisible}
          onHiding={this.hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={false}
          showCloseButton={true}
          showTitle={true}
          title={this.state.detailTitle}
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={this.closeButtonOptions}
          />
          <ScrollView width="100%" height="100%">
            <CumplimientoOfertaDG
              dataSource={this.state.dataDetail}
              visible={true}
              ref={this._CumplimientoOfertaDG}
              summaryVisible={true}
              summaryTitle={this.state.summaryTitle}
            />
            <VencidosDG
              dataSource={this.state.dataDetailVencido}
              title="Vencido"
              visible={this.state.showVencido}
              ref={this._detailGridVencidos}
              summaryVisible={false}
              summaryTitle=""
            />
          </ScrollView>
        </Popup>

        {/* Calidad Entrega */}
        <Popup
          visible={this.state.CalidadEntregaDGVisible}
          onHiding={this.hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={false}
          showCloseButton={true}
          showTitle={true}
          title={this.state.detailTitle}
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={this.closeButtonOptions}
          />
          <ScrollView width="100%" height="100%">
            <CalidadEntregaDG
              dataSource={this.state.dataDetail}
              visible={true}
              ref={this._CalidadEntregaDG}
              summaryVisible={true}
              summaryTitle={this.state.summaryTitle}
            />
          </ScrollView>
        </Popup>

        {/* Calidad Factura */}
        <Popup
          visible={this.state.CalidadFacturaDGVisible}
          onHiding={this.hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={false}
          showCloseButton={true}
          showTitle={true}
          title={this.state.detailTitle}
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={this.closeButtonOptions}
          />
          <ScrollView width="100%" height="100%">
            <CalidadFacturaDG
              dataSource={this.state.dataDetail}
              visible={true}
              ref={this._CalidadFacturaDG}
              summaryVisible={true}
              summaryTitle={this.state.summaryTitle}
            />
          </ScrollView>
        </Popup>

        {/* No Stockout */}
        <Popup
          visible={this.state.NoStockoutDGVisible}
          onHiding={this.hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={false}
          showCloseButton={true}
          showTitle={true}
          title={this.state.detailTitle}
        >
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={this.closeButtonOptions}
          />
          <ScrollView width="100%" height="100%">
            <NoStockoutDG
              dataSource={this.state.dataDetail}
              visible={true}
              ref={this._NoStockoutDG}
              summaryVisible={true}
              summaryTitle={this.state.summaryTitle}
            />
          </ScrollView>
        </Popup>
      </>
    );

    const contenido =
      this.state.buscador === true && idPedidoParam === null ? buscadorContent : detalleContent;

    return (
      <>
        <div className="content mb-5">{contenido}</div>
      </>
    );
  }
}

POI.contextType = AppContext;
export default POI;
