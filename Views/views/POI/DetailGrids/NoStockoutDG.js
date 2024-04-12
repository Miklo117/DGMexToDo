/* eslint-disable react/jsx-no-undef */

import React, {useMemo} from 'react';

import { Row, Col, Spinner } from 'reactstrap';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import DataGrid, { Export, Scrolling, Paging, Summary, TotalItem, Column } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { callApi, callKrakenApi, languageInit, Translate } from '../../../utils/utils';

export default class NoStockoutDG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentRow: 0,
      CurrentColumn: 0,
      HeaderRow: 0,
      totalRows: 0,
      acceptedTotal:0,
      totalColumns: 0,
    };
    this.calculateSelectedRow = this.calculateSelectedRow.bind(this);
  }

  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('No Stockout');

    exportDataGrid({
      component: e.component,
      autoFilterEnabled: true,
      worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),`Nostockout.xlsx`);
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

      this.setState({totalRows: this.state.totalRows+1});
      
      if(options.value.CumpleLineFillRate === "SI")
      this.setState({acceptedTotal: this.state.acceptedTotal+1});
      options.totalValue = `${this.state.acceptedTotal}/${this.state.totalRows}`;

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
            id="NoStockoutDG"
            dataSource={this.props.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            onExporting={this.onExporting}
          >
            <Column
              dataField="ClaPedido"
              caption={Translate("NoStockout.Clave Pedido")}
            />

            <Column
              dataField="TipoPedido"
              caption={Translate("NoStockout.Tipo Pedido")}
            />

            <Column
              dataField="NombreUbicacion"
              caption={Translate("NoStockout.Nombre Ubicacion")}
            />

            <Column
              dataField="NombreTipoUbicacion"
              caption={Translate("NoStockout.Nombre TipoUbicacion")}
            />

            <Column
              dataField="DiasOferta"
              caption={Translate("NoStockout.Dias Oferta")}
            />

            <Column
              dataField="TipoInventario"
              caption={Translate("NoStockout.Tipo Inventario")}
            />

            <Column
              dataField="ClaveProductoATO"
              caption={Translate("NoStockout.Clave Producto ATO")}
            />

            <Column
              dataField="TipoInventarioATO"
              caption={Translate("NoStockout.Tipo Inventario ATO")}
            />

            <Column
              dataField="FechaDeseado"
              caption={Translate("NoStockout.Fecha Deseado")}
            />

            <Column
              dataField="FechaPedido"
              caption={Translate("NoStockout.Fecha Pedido")}
            />

            <Column
              dataField="CalculoConExistencia"
              caption={Translate("NoStockout.Calculo Con Existencia")}
            />

            <Column
              dataField="PedidoOferta"
              caption={Translate("NoStockout.Pedido Oferta")}
            />

            <Column
              dataField="Cliente"
              caption={Translate("NoStockout.Cliente")}
            />

            <Column
              dataField="NombreCliente"
              caption={Translate("NoStockout.Nombre Cliente")}
            />

            <Column
              dataField="TipoProducto"
              caption={Translate("NoStockout.Tipo Producto")}
            />

            <Column
              dataField="ClaveProducto"
              caption={Translate("NoStockout.Clave Producto")}
            />

            <Column
              dataField="NombreCorto"
              caption={Translate("NoStockout.Nombre Corto")}
            />

            <Column
              dataField="CantidadSurtida"
              caption={Translate("NoStockout.Cantidad Surtida")}
            />

            <Column
              dataField="PorcentajeSurtimiendo"
              caption={Translate("NoStockout.Porcentaje Surtimiendo")}
            />

            <Column
              dataField="FechaPromesaEmbarquePrimera"
              caption={Translate("NoStockout.Fecha Promesa Embarque Primera")}
            />

            <Column
              dataField="FechaSurtidoTotal"
              caption={Translate("NoStockout.Fecha Surtido Total")}
            />

            <Column
              dataField="FechaPromesaEntrega"
              caption={Translate("NoStockout.Fecha Promesa Entrega")}
            />

            <Column
              dataField="FechaEntrega"
              caption={Translate("NoStockout.Fecha Entrega")}
            />

            <Column
              dataField="MotivoVencimientoEntrega"
              caption={Translate("NoStockout.Motivo Vencimiento Entrega")}
            />

            <Column
              dataField="NumViaje"
              caption={Translate("NoStockout.NumViaje")}
            />

            <Column
              dataField="Transportista"
              caption={Translate("NoStockout.Transportista")}
            />

            <Column
              dataField="CumpleLineFillRate"
              caption={Translate("NoStockout.Cumple Line Fill Rate")}
            />

            <Column
              dataField="MotivoVencimientoEmbarque"
              caption={Translate("NoStockout.Motivo Vencimiento Embarque")}
            />

            <Column
              dataField="MotivoVencimientoEmbarquePedido"
              caption={Translate("NoStockout.Motivo Vencimiento EmbarquePedido")}
            />

            <Column
              dataField="MotivoCancelacion"
              caption={Translate("NoStockout.Motivo Cancelacion")}
            />

            <Column
              dataField="Ciudad"
              caption={Translate("NoStockout.Ciudad")}
            />

            <Column
              dataField="Estado"
              caption={Translate("NoStockout.Estado")}
            />

            <Column
              dataField="NombreDireccion"
              caption={Translate("NoStockout.Nombre Direccion")}
            />

            <Column
              dataField="NombreSubDireccion"
              caption={Translate("NoStockout.Nombre SubDireccion")}
            />

            <Column
              dataField="NombreGerenteRegional"
              caption={Translate("NoStockout.Nombre Gerente Regional")}
            />

            <Column
              dataField="NombreGerente"
              caption={Translate("NoStockout.Nombre Gerente")}
            />

            <Column
              dataField="NombreAgente"
              caption={Translate("NoStockout.Nombre Agente")}
            />

            <Column
              dataField="NombreEmpresa"
              caption={Translate("NoStockout.Nombre Empresa")}
            />

            <Column
              dataField="NombreClienteAgrupador"
              caption={Translate("NoStockout.Nombre Cliente Agrupador")}
            />

            <Column
              dataField="Segmento"
              caption={Translate("NoStockout.Segmento")}
            />

            <Column
              dataField="Oferta_Servicio"
              caption={Translate("NoStockout.Oferta Servicio")}
            />

            <Column
              dataField="NombreFamilia"
              caption={Translate("NoStockout.Nombre Familia")}
            />

            <Column
              dataField="NombreSubFamilia"
              caption={Translate("NoStockout.Nombre Sub Familia")}
            />

            <Column
              dataField="NombreGrupoEstadistico1"
              caption={Translate("NoStockout.Nombre Grupo Estadistico1")}
            />

            <Column
              dataField="NombreGrupoEstadistico2"
              caption={Translate("NoStockout.Nombre Grupo Estadistico2")}
            />

            <Column
              dataField="NombreGrupoEstadistico3"
              caption={Translate("NoStockout.Nombre Grupo Estadistico3")}
            />

            <Column
              dataField="NombreGrupoEstadistico4"
              caption={Translate("NoStockout.Nombre Grupo Estadistico4")}
            />
            <Scrolling />
            <Paging defaultPageSize={10} />
            <Export enabled={true} allowExportSelectedData={true} />
            <Summary calculateCustomSummary={this.calculateSelectedRow} visible={this.props.summaryVisible}>
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                displayFormat="NoStockout: {0}"
                showInColumn={Translate("NoStockout.Clave Pedido")}
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
