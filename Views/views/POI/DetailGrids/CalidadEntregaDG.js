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

export default class CalidadEntregaDG extends React.Component {
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
    const worksheet = workbook.addWorksheet('Calidad Entrega');

    exportDataGrid({
      component: e.component,
      autoFilterEnabled: true,
      worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),`CalidadEntrega.xlsx`);
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
        if(options.value.CumpleQualityDelivery === "SI")
          this.setState({acceptedTotal: this.state.acceptedTotal+1});
        this.state.pedidos.push(options.value.ClaPedido)
      }
      else if(!this.state.pedidosReContados.includes(options.value.ClaPedido)){
        if(options.value.CumpleQualityDelivery === "No"){
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
            id="CalidadEntregaDG"
            dataSource={this.props.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            onExporting={this.onExporting}
          >         
                      
            <Column
            dataField="ClaPedido"
            caption={Translate("CalidadEntrega.Clave Pedido")}
            />
            <Column
            dataField="TipoPedido"
            caption={Translate("CalidadEntrega.Tipo Pedido")}
            />
            <Column
            dataField="NombreUbicacion"
            caption={Translate("CalidadEntrega.Nombre Ubicacion")}
            />
            <Column
            dataField="NombreTipoUbicacion"
            caption={Translate("CalidadEntrega.Nombre TipoUbicacion")}
            />
            <Column
            dataField="TipoInventario"
            caption={Translate("CalidadEntrega.Tipo Inventario")}
            />
            <Column
            dataField="FechaDeseado"
            caption={Translate("CalidadEntrega.Fecha Deseado")}
            />
            <Column
            dataField="FechaPedido"
            caption={Translate("CalidadEntrega.Fecha Pedido")}
            />
            <Column
            dataField="CalculoConExistencia"
            caption={Translate("CalidadEntrega.Calculo Con Existencia")}
            />
            <Column
            dataField="PedidoOferta"
            caption={Translate("CalidadEntrega.Pedido Oferta")}
            />
            <Column
            dataField="IdSituacionMotivo"
            caption={Translate("CalidadEntrega.Id Situacion Motivo")}
            />
            <Column
            dataField="NomMotivo"
            caption={Translate("CalidadEntrega.Nom Motivo")}
            />
            <Column
            dataField="IdReclamacion"
            caption={Translate("CalidadEntrega.Id Reclamacion")}
            />
            <Column
            dataField="IdFactura"
            caption={Translate("CalidadEntrega.Id Factura")}
            />
            <Column
            dataField="IdFacturaAlfanumerico"
            caption={Translate("CalidadEntrega.Id Factura Alfanumerico")}
            />
            <Column
            dataField="ClaReclamacion"
            caption={Translate("CalidadEntrega.Clave Reclamacion")}
            />
            <Column
            dataField="ClaEstatus"
            caption={Translate("CalidadEntrega.Clavr Estatus")}
            />
            <Column
            dataField="NomEstatus"
            caption={Translate("CalidadEntrega.Nombre Estatus")}
            />
            <Column
            dataField="DescProblema"
            caption={Translate("CalidadEntrega.Descripcion Problema")}
            />
            <Column
            dataField="Cliente"
            caption={Translate("CalidadEntrega.Cliente")}
            />
            <Column
            dataField="NombreCliente"
            caption={Translate("CalidadEntrega.Nombre Cliente")}
            />
            <Column
            dataField="TipoProducto"
            caption={Translate("CalidadEntrega.Tipo Producto")}
            />
            <Column
            dataField="ClaveProducto"
            caption={Translate("CalidadEntrega.Clave Producto")}
            />
            <Column
            dataField="NombreCorto"
            caption={Translate("CalidadEntrega.Nombre Corto")}
            />
            <Column
            dataField="CantidadSurtida"
            caption={Translate("CalidadEntrega.Cantidad Surtida")}
            />
            <Column
            dataField="PorcentajeSurtimiendo"
            caption={Translate("CalidadEntrega.Porcentaje Surtimiendo")}
            />
            <Column
            dataField="FechaPromesaEmbarquePrimera"
            caption={Translate("CalidadEntrega.FechaPromesa Embarque Primera")}
            />
            <Column
            dataField="FechaSurtidoTotal"
            caption={Translate("CalidadEntrega.Fecha Surtido Total")}
            />
            <Column
            dataField="FechaPromesaEntrega"
            caption={Translate("CalidadEntrega.Fecha Promesa Entrega")}
            />
            <Column
            dataField="FechaEntrega"
            caption={Translate("CalidadEntrega.Fecha Entrega")}
            />
            <Column
            dataField="MotivoVencimientoEntrega"
            caption={Translate("CalidadEntrega.Motivo Vencimiento Entrega")}
            />
            <Column
            dataField="NumViaje"
            caption={Translate("CalidadEntrega.Numero de Viaje")}
            />
            <Column
            dataField="Transportista"
            caption={Translate("CalidadEntrega.Transportista")}
            />
            <Column
            dataField="CumpleQualityDelivery"
            caption={Translate("CalidadEntrega.Cumple Calidad de Etrega")}
            />
            <Column
            dataField="MotivoVencimientoEmbarque"
            caption={Translate("CalidadEntrega.Motivo Vencimiento Embarque")}
            />
            <Column
            dataField="MotivoVencimientoEmbarquePedido"
            caption={Translate("CalidadEntrega.Motivo Vencimiento Embarque Pedido")}
            />
            <Column
            dataField="MotivoCancelacion"
            caption={Translate("CalidadEntrega.Motivo Cancelacion")}
            />
            <Column
            dataField="Ciudad"
            caption={Translate("CalidadEntrega.Ciudad")}
            />
            <Column
            dataField="Estado"
            caption={Translate("CalidadEntrega.Estado")}
            />
            <Column
            dataField="NombreDireccion"
            caption={Translate("CalidadEntrega.Nombre Direccion")}
            />
            <Column
            dataField="NombreSubDireccion"
            caption={Translate("CalidadEntrega.Nombre SubDireccion")}
            />
            <Column
            dataField="NombreGerenteRegional"
            caption={Translate("CalidadEntrega.Nombre Gerente Regional")}
            />
            <Column
            dataField="NombreGerente"
            caption={Translate("CalidadEntrega.Nombre Gerente")}
            />

            <Column
            dataField="NombreAgente"
            caption={Translate("CalidadEntrega.Nombre Agente")}
            />
            <Column
            dataField="NombreEmpresa"
            caption={Translate("CalidadEntrega.Nombre Empresa")}
            />
            <Column
            dataField="NombreClienteAgrupador"
            caption={Translate("CalidadEntrega.Nombre Cliente Agrupador")}
            />
            <Column
            dataField="Segmento"
            caption={Translate("CalidadEntrega.Segmento")}
            />
            <Column
            dataField="Oferta_Servicio"
            caption={Translate("CalidadEntrega.Oferta Servicio")}
            />
            <Column
            dataField="NombreFamilia"
            caption={Translate("CalidadEntrega.Nombre Familia")}
            />
            <Column
            dataField="NombreSubFamilia"
            caption={Translate("CalidadEntrega.Nombre SubFamilia")}
            />
            <Column
            dataField="NombreGrupoEstadistico1"
            caption={Translate("CalidadEntrega.NombreGrupoEstadistico1")}
            />
            <Column
            dataField="NombreGrupoEstadistico2"
            caption={Translate("CalidadEntrega.Nombre Grupo Estadistico2")}
            />
            <Column
            dataField="NombreGrupoEstadistico3"
            caption={Translate("CalidadEntrega.Nombre Grupo Estadistico3")}
            />
            <Column
            dataField="NombreGrupoEstadistico4"
            caption={Translate("CalidadEntrega.Nombre Grupo Estadistico4")}
            /> 
            <Scrolling />
            <Paging defaultPageSize={10} />
            <Export enabled={true} allowExportSelectedData={true} />
            <Summary calculateCustomSummary={this.calculateSelectedRow} visible={this.props.summaryVisible}>
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                displayFormat="Calidad Entrega: {0}"
                showInColumn={Translate("CalidadEntrega.Clave Pedido")}
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
