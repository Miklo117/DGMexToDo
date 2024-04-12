
import React, {useMemo} from 'react';

import { Row, Col, Spinner } from 'reactstrap';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import DataGrid, { Export, Scrolling, Paging, Summary, TotalItem, Column } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { callApi, callKrakenApi, languageInit, Translate } from '../../../utils/utils';

export default class CumplimientoOfertaDG extends React.Component {
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
    const worksheet = workbook.addWorksheet('Cumplimiento Oferta');

    exportDataGrid({
      component: e.component,
      autoFilterEnabled: true,
      worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),`OfertaDG.xlsx`);
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
        if(options.value.CumplioEntregaCliente === "SI")
          this.setState({acceptedTotal: this.state.acceptedTotal+1});
        this.state.pedidos.push(options.value.ClaPedido)
      }
      else if(!this.state.pedidosReContados.includes(options.value.ClaPedido)){
        if(options.value.CumplioEntregaCliente === "No"){
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
          <h4>{Translate("Pivot.CumplimientoOferta")}</h4>
          {spinner}
          <DataGrid
            visible={this.props.visible}
            id="CumplimientoOfertaDG"
            dataSource={this.props.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            onExporting={this.onExporting}
          >        
            <Column
              dataField="ClaPedido"
              caption={Translate("CumplimientoOferta.Clave Pedido")}
            />

            <Column
              dataField="TipoPedido"
              caption={Translate("CumplimientoOferta.Tipo Pedido")}
            />

            <Column
              dataField="NombreUbicacion"
              caption={Translate("CumplimientoOferta.Nombre Ubicacion")}
            />

            <Column
              dataField="NombreTipoUbicacion"
              caption={Translate("CumplimientoOferta.Nombre Tipo Ubicacion")}
            />

            <Column
              dataField="PedidoOferta"
              caption={Translate("CumplimientoOferta.Pedido Oferta")}
            />

            <Column
              dataField="Cliente"
              caption={Translate("CumplimientoOferta.Cliente")}
            />

            <Column
              dataField="NombreCliente"
              caption={Translate("CumplimientoOferta.Nombre Cliente")}
            />

            <Column
              dataField="TipoProducto"
              caption={Translate("CumplimientoOferta.Tipo Producto")}
            />

            <Column
              dataField="ClaveProducto"
              caption={Translate("CumplimientoOferta.Clave Producto")}
            />

            <Column
              dataField="NombreCorto"
              caption={Translate("CumplimientoOferta.Nombre Corto")}
            />

            <Column
              dataField="CantidadSurtida"
              caption={Translate("CumplimientoOferta.Cantidad Surtida")}
            />

            <Column
              dataField="PorcentajeSurtimiendo"
              caption={Translate("CumplimientoOferta.Porcentaje Surtimiendo")}
            />

            <Column
              dataField="FechaPromesaEmbarquePrimera"
              caption={Translate("CumplimientoOferta.Fecha Promesa Embarque Primera")}
            />

            <Column
              dataField="FechaSurtidoTotal"
              caption={Translate("CumplimientoOferta.Fecha Surtido Total")}
            />

            <Column
              dataField="FechaPromesaEntrega"
              caption={Translate("CumplimientoOferta.Fecha Promesa Entrega")}
            />

            <Column
              dataField="FechaEntrega"
              caption={Translate("CumplimientoOferta.Fecha Entrega")}
            />

            <Column
              dataField="MotivoVencimientoEntrega"
              caption={Translate("CumplimientoOferta.Motivo Vencimiento Entrega")}
            />

            <Column
              dataField="NumViaje"
              caption={Translate("CumplimientoOferta.Numero de Viaje")}
            />

            <Column
              dataField="Transportista"
              caption={Translate("CumplimientoOferta.Transportista")}
            />

            <Column
              dataField="CumplioEntregaCliente"
              caption={Translate("CumplimientoOferta.Cumplió Entrega Cliente")}
            />

            <Column
              dataField="MotivoVencimientoEmbarque"
              caption={Translate("CumplimientoOferta.Motivo Vencimiento Embarque")}
            />

            <Column
              dataField="MotivoVencimientoEmbarquePedido"
              caption={Translate("CumplimientoOferta.Motivo Vencimiento Embarque Pedido")}
            />

            <Column
              dataField="MotivoCancelacion"
              caption={Translate("CumplimientoOferta.Motivo Cancelacion")}
            />

            <Column
              dataField="Ciudad"
              caption={Translate("CumplimientoOferta.Ciudad")}
            />

            <Column
              dataField="Estado"
              caption={Translate("CumplimientoOferta.Estado")}
            />

            <Column
              dataField="NombreDireccion"
              caption={Translate("CumplimientoOferta.Nombre Direccion")}
            />

            <Column
              dataField="NombreSubDireccion"
              caption={Translate("CumplimientoOferta.Nombre SubDireccion")}
            />

            <Column
              dataField="NombreGerenteRegional"
              caption={Translate("CumplimientoOferta.Nombre Gerente Regional")}
            />

            <Column
              dataField="NombreGerente"
              caption={Translate("CumplimientoOferta.Nombre Gerente")}
            />

            <Column
              dataField="NombreAgente"
              caption={Translate("CumplimientoOferta.Nombre Agente")}
            />

            <Column
              dataField="NombreEmpresa"
              caption={Translate("CumplimientoOferta.Nombre Empresa")}
            />

            <Column
              dataField="NombreClienteAgrupador"
              caption={Translate("CumplimientoOferta.Nombre Cliente Agrupador")}
            />

            <Column
              dataField="Segmento"
              caption={Translate("CumplimientoOferta.Segmento")}
            />

            <Column
              dataField="Oferta_Servicio"
              caption={Translate("CumplimientoOferta.Oferta Servicio")}
            />

            <Column
              dataField="NombreFamilia"
              caption={Translate("CumplimientoOferta.Nombre Familia")}
            />

            <Column
              dataField="NombreSubFamilia"
              caption={Translate("CumplimientoOferta.Nombre SubFamilia")}
            />

            <Column
              dataField="NombreGrupoEstadistico1"
              caption={Translate("CumplimientoOferta.Nombre Grupo Estadistico1")}
            />

            <Column
              dataField="NombreGrupoEstadistico2"
              caption={Translate("CumplimientoOferta.Nombre Grupo Estadistico2")}
            />

            <Column
              dataField="NombreGrupoEstadistico3"
              caption={Translate("CumplimientoOferta.Nombre Grupo Estadistico3")}
            />

            <Column
              dataField="NombreGrupoEstadistico4"
              caption={Translate("CumplimientoOferta.Nombre Grupo Estadistico4")}
            />

            <Column
              dataField="ClaUbicacion"
              caption={Translate("CumplimientoOferta.Clave Ubicacion")}
            />

            <Column
              dataField="ClaProducto"
              caption={Translate("CumplimientoOferta.ClaProducto")}
            />

            <Column
              dataField="ClaArticulo"
              caption={Translate("CumplimientoOferta.Clave Articulo")}
            />

            <Column
              dataField="DescMotivoFechaCalculada"
              caption={Translate("CumplimientoOferta.Descripcion Motivo Fecha Calculada")}
            />
  
            <Scrolling />
            <Paging defaultPageSize={10} />
            <Export enabled={true} allowExportSelectedData={true} />
            <Summary calculateCustomSummary={this.calculateSelectedRow} visible={this.props.summaryVisible}>
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                displayFormat="Cumplimiento Oferta: {0}"
                showInColumn={Translate("CumplimientoOferta.Clave Pedido")}
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
