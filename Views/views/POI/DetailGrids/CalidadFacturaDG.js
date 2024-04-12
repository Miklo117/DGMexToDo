/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-indent-props */

import React, {useMemo} from 'react';

import { Row, Col, Spinner } from 'reactstrap';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import DataGrid, { Export, Scrolling, Paging, Summary, TotalItem, Column } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { callApi, callKrakenApi, languageInit, Translate } from '../../../utils/utils';

export default class CalidadFacturaDG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentRow: 0,
      CurrentColumn: 0,
      HeaderRow: 0,
      totalRows: 0,
      acceptedTotal:0,
      totalColumns: 0,
      pedidos:[],
      pedidosReContados:[]
    };
    this.calculateSelectedRow = this.calculateSelectedRow.bind(this);
  }

  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Calidad Factura');

    exportDataGrid({
      component: e.component,
      autoFilterEnabled: true,
      worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),`CalidadFactura.xlsx`);
      });
    });
    e.cancel = true;
  }

  calculateSelectedRow(options) {
    if (options.summaryProcess === 'start') {
      options.totalValue = "";
      this.setState({totalRows: 0, acceptedTotal: 0});
    } 
    else if (options.summaryProcess === 'calculate') {
      if(!this.state.pedidos.includes(options.value.ClaPedido)){
        this.setState({totalRows: this.state.totalRows+1});
        if(options.value.CumpleQIPedidoSN === "SI")
          this.setState({acceptedTotal: this.state.acceptedTotal+1});
        this.state.pedidos.push(options.value.ClaPedido)
      }
      else if(!this.state.pedidosReContados.includes(options.value.ClaPedido)){
        if(options.value.CumpleQIPedidoSN === "No"){
          this.setState({acceptedTotal: this.state.acceptedTotal-1});
          this.state.pepedidosReContadosdidos.push(options.value.ClaPedido);
        }
      }
      
    }
    else if (options.summaryProcess === 'finalize') {
      options.totalValue = `${this.state.acceptedTotal}/${this.state.totalRows}`;
      this.setState({pedidos: []});
    }
  }

  componentDidMount() {

  }

  render() {
    languageInit();

    const spinner =
      this.state.showSpin === true ? (
        <Loader type="Puff" color="#00BFFF" height={40} width={40} />
      ) : (<></>);
    const gridContent = (
      <Row>
        <Col md={{size: 12}}>
          {spinner}
          <DataGrid
            visible={this.props.visible}
            id="CalidadFacturaDG"
            dataSource={this.props.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            onExporting={this.onExporting}
          >       
            <Column
            dataField="ClaPedido"
            caption={Translate("CalidadFactura.ClaPedido")}
            />
            <Column
            dataField="TipoPedido"
            caption={Translate("CalidadFactura.Tipo Pedido")}
            />
            <Column
            dataField="NombreUbicacion"
            caption={Translate("CalidadFactura.Nombre Ubicacion")}
            />
            <Column
            dataField="NombreTipoUbicacion"
            caption={Translate("CalidadFactura.Nombre TipoUbicacion")}
            />
            <Column
            dataField="PedidoOferta"
            caption={Translate("CalidadFactura.Pedido Oferta")}
            />
            <Column
            dataField="Cliente"
            caption={Translate("CalidadFactura.Cliente")}
            />
            <Column
            dataField="NombreCliente"
            caption={Translate("CalidadFactura.Nombre Cliente")}
            />
            <Column
            dataField="TipoProducto"
            caption={Translate("CalidadFactura.Tipo Producto")}
            />
            <Column
            dataField="ClaveProducto"
            caption={Translate("CalidadFactura.Clave Producto")}
            />
            <Column
            dataField="NombreCorto"
            caption={Translate("CalidadFactura.Nombre Corto")}
            />
            <Column
            dataField="CantidadSurtida"
            caption={Translate("CalidadFactura.Cantidad Surtida")}
            />
            <Column
            dataField="PorcentajeSurtimiendo"
            caption={Translate("CalidadFactura.Porcentaje Surtimiendo")}
            />
            <Column
            dataField="FechaPromesaEmbarquePrimera"
            caption={Translate("CalidadFactura.Fecha Promesa Embarque Primera")}
            />
            <Column
            dataField="FechaSurtidoTotal"
            caption={Translate("CalidadFactura.Fecha Surtido Total")}
            />
            <Column
            dataField="FechaPromesaEntrega"
            caption={Translate("CalidadFactura.Fecha Promesa Entrega")}
            />
            <Column
            dataField="FechaEntrega"
            caption={Translate("CalidadFactura.Fecha Entrega")}
            />
            <Column
            dataField="MotivoVencimientoEntrega"
            caption={Translate("CalidadFactura.Motivo Vencimiento Entrega")}
            />
            <Column
            dataField="NumViaje"
            caption={Translate("CalidadFactura.Numero de Viaje")}
            />
            <Column
            dataField="Transportista"
            caption={Translate("CalidadFactura.Transportista")}
            />
            <Column
            dataField="CumplioEntregaCliente"
            caption={Translate("CalidadFactura.Cumplio Entrega Cliente")}
            />
            <Column
            dataField="MotivoVencimientoEmbarque"
            caption={Translate("CalidadFactura.Motivo Vencimiento Embarque")}
            />
            <Column
            dataField="MotivoVencimientoEmbarquePedido"
            caption={Translate("CalidadFactura.Motivo Vencimiento Embarque Pedido")}
            />
            <Column
            dataField="MotivoCancelacion"
            caption={Translate("CalidadFactura.Motivo Cancelacion")}
            />
            <Column
            dataField="Ciudad"
            caption={Translate("CalidadFactura.Ciudad")}
            />
            <Column
            dataField="Estado"
            caption={Translate("CalidadFactura.Estado")}
            />
            <Column
            dataField="NombreDireccion"
            caption={Translate("CalidadFactura.Nombre Direccion")}
            />
            <Column
            dataField="NombreSubDireccion"
            caption={Translate("CalidadFactura.Nombre SubDireccion")}
            />
            <Column
            dataField="NombreGerenteRegional"
            caption={Translate("CalidadFactura.Nombre Gerente Regional")}
            />
            <Column
            dataField="NombreGerente"
            caption={Translate("CalidadFactura.Nombre Gerente")}
            />
            <Column
            dataField="NombreAgente"
            caption={Translate("CalidadFactura.Nombre Agente")}
            />
            <Column
            dataField="NombreEmpresa"
            caption={Translate("CalidadFactura.Nombre Empresa")}
            />
            <Column
            dataField="NombreClienteAgrupador"
            caption={Translate("CalidadFactura.Nombre Cliente Agrupador")}
            />
            <Column
            dataField="Segmento"
            caption={Translate("CalidadFactura.Segmento")}
            />
            <Column
            dataField="Oferta_Servicio"
            caption={Translate("CalidadFactura.Oferta Servicio")}
            />
            <Column
            dataField="NombreFamilia"
            caption={Translate("CalidadFactura.Nombre Familia")}
            />
            <Column
            dataField="NombreSubFamilia"
            caption={Translate("CalidadFactura.Nombre SubFamilia")}
            />
            <Column
            dataField="NombreGrupoEstadistico1"
            caption={Translate("CalidadFactura.Nombre Grupo Estadistico1")}
            />
            <Column
            dataField="NombreGrupoEstadistico2"
            caption={Translate("CalidadFactura.Nombre Grupo Estadistico2")}
            />
            <Column
            dataField="NombreGrupoEstadistico3"
            caption={Translate("CalidadFactura.Nombre Grupo Estadistico3")}
            />
            <Column
            dataField="NombreGrupoEstadistico4"
            caption={Translate("CalidadFactura.Nombre Grupo Estadistico4")}
            />
            <Column
            dataField="CumpleQIPedidoSN"
            caption={Translate("CalidadFactura.Cumple Calidad FacturaSN")}
            />
            <Column
            dataField="TieneProforma"
            caption={Translate("CalidadFactura.Tiene Proforma")}
            />
            <Column
            dataField="TieneProformaSN"
            caption={Translate("CalidadFactura.Tiene ProformaSN")}
            />
            <Column
            dataField="CumpleQualityInvoicePedido"
            caption={Translate("CalidadFactura.Cumple Calidad Factura Pedido")}
            />
            <Column
            dataField="NumFactura"
            caption={Translate("CalidadFactura.Numero de Factura")}
            />
            <Column
            dataField="FactAlf"
            caption={Translate("CalidadFactura.FactAlf")}
            />
            <Column
            dataField="proforma"
            caption={Translate("CalidadFactura.proforma")}
            />
            <Column
            dataField="ProfAlf"
            caption={Translate("CalidadFactura.ProfAlf")}
            />   
            <Scrolling />
            <Paging defaultPageSize={10} />
            <Export enabled={true} allowExportSelectedData={true} />
            <Summary calculateCustomSummary={this.calculateSelectedRow} visible={this.props.summaryVisible}>
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                displayFormat="Calidad Factura: {0}"
                showInColumn={Translate("CalidadFactura.ClaPedido")}
              />
            </Summary>
          </DataGrid>
        </Col>
      </Row>
    );

    return (
      <>
        {gridContent}
      </>
    );
  }
}
