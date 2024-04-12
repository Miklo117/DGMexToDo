
import React, {useMemo} from 'react';

import { Row, Col, Spinner } from 'reactstrap';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import DataGrid, { Export, Scrolling, Paging, Summary, TotalItem, Column } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { callApi, callKrakenApi, languageInit, Translate } from '../../../utils/utils';

export default class VencidosDG extends React.Component {
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
    const worksheet = workbook.addWorksheet('Pedidos Vencidos');

    exportDataGrid({
      component: e.component,
      autoFilterEnabled: true,
      worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),`Vencidos.xlsx`);
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
        this.state.pedidos.push(options.value.ClaPedido)
      }
    }
    else if (options.summaryProcess === 'finalize') {
      options.totalValue = ` ${this.state.totalRows}`;
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
          <h4>{Translate("Pivot.Vencidos")}</h4>
          <DataGrid
            visible={this.props.visible}
            id="VencidosDG"
            dataSource={this.props.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            onExporting={this.onExporting}
          >
            <Column
              dataField="ClaPedido"
              caption={Translate("Vencidos.Cla Pedido")}
            />

            <Column
              dataField="ClaUbicacion"
              caption={Translate("Vencidos.Cla Ubicacion")}
            />

            <Column
              dataField="NombreUbicacion"
              caption={Translate("Vencidos.Nombre Ubicacion")}
            />

            <Column
              dataField="ClaTipoUbicacion"
              caption={Translate("Vencidos.Cla Tipo Ubicacion")}
            />

            <Column
              dataField="NombreTipoUbicacion"
              caption={Translate("Vencidos.Nombre TipoUbicacion")}
            />

            <Column
              dataField="FechaPedido"
              caption={Translate("Vencidos.Fecha Pedido")}
            />

            <Column
              dataField="FechaPromesaEmbarquePrimera"
              caption={Translate("Vencidos.Fecha Promesa Embarque Primera")}
            />

            <Column
              dataField="Num_Dias_Vencido"
              caption={Translate("Vencidos.Num Dias Vencido")}
            />

            <Column
              dataField="RangoVencido"
              caption={Translate("Vencidos.Rango Vencido")}
            />

            <Column
              dataField="Total_Dias_Vencido"
              caption={Translate("Vencidos.Total Dias Vencido")}
            />

            <Column
              dataField="ClaveProducto"
              caption={Translate("Vencidos.Clave Producto")}
            />

            <Column
              dataField="NombreCorto"
              caption={Translate("Vencidos.Nombre Corto")}
            />

            <Column
              dataField="TipoProducto"
              caption={Translate("Vencidos.Tipo Producto")}
            />

            <Column
              dataField="ClaFamilia"
              caption={Translate("Vencidos.Clave Familia")}
            />

            <Column
              dataField="Nombre_Familia"
              caption={Translate("Vencidos.Nombre Familia")}
            />

            <Column
              dataField="ClaSubFamilia"
              caption={Translate("Vencidos.Cla Sub Familia")}
            />

            <Column
              dataField="Nombre_SubFamilia"
              caption={Translate("Vencidos.Nombre SubFamilia")}
            />

            <Column
              dataField="ClaCliente"
              caption={Translate("Vencidos.Clave Cliente")}
            />

            <Column
              dataField="NombreCliente"
              caption={Translate("Vencidos.Nombre Cliente")}
            />

            <Column
              dataField="Ciudad"
              caption={Translate("Vencidos.Ciudad")}
            />

            <Column
              dataField="Estado"
              caption={Translate("Vencidos.Estado")}
            />

            <Column
              dataField="ClaClienteFinal"
              caption={Translate("Vencidos.Clave Cliente Final")}
            />

            <Column
              dataField="NombreClienteFinal"
              caption={Translate("Vencidos.Nombre Cliente Final")}
            />

            <Column
              dataField="CantidadSolicitada"
              caption={Translate("Vencidos.Cantidad Solicitada")}
            />

            <Column
              dataField="CantidadSurtida"
              caption={Translate("Vencidos.Cantidad Surtida")}
            />

            <Column
              dataField="TonsSaldo"
              caption={Translate("Vencidos.Tons Saldo")}
            />

            <Column
              dataField="NombreDireccion"
              caption={Translate("Vencidos.Nombre Direccion")}
            />

            <Column
              dataField="NombreSubDireccion"
              caption={Translate("Vencidos.Nombre SubDireccion")}
            />

            <Column
              dataField="NombreGerenteRegional"
              caption={Translate("Vencidos.Nombre Gerente Regional")}
            />

            <Column
              dataField="NombreGerente"
              caption={Translate("Vencidos.Nombre Gerente")}
            />

            <Column
              dataField="NombreAgente"
              caption={Translate("Vencidos.Nombre Agente")}
            />

            <Column
              dataField="NombreEmpresa"
              caption={Translate("Vencidos.Nombre Empresa")}
            />

            <Column
              dataField="NombreClienteAgrupador"
              caption={Translate("Vencidos.Nombre Cliente Agrupador")}
            />

            <Column
              dataField="Segmento"
              caption={Translate("Vencidos.Segmento")}
            />

            <Column
              dataField="Oferta_Servicio"
              caption={Translate("Vencidos.Oferta Servicio")}
            />

            <Column
              dataField="NombreFamilia"
              caption={Translate("Vencidos.NombreFamilia")}
            />

            <Column
              dataField="NombreSubFamilia"
              caption={Translate("Vencidos.NombreSubFamilia")}
            />

            <Column
              dataField="NombreGrupoEstadistico1"
              caption={Translate("Vencidos.Nombre Grupo Estadistico1")}
            />

            <Column
              dataField="NombreGrupoEstadistico2"
              caption={Translate("Vencidos.Nombre Grupo Estadistico2")}
            />

            <Column
              dataField="NombreGrupoEstadistico3"
              caption={Translate("Vencidos.Nombre Grupo Estadistico3")}
            />

            <Column
              dataField="NombreGrupoEstadistico4"
              caption={Translate("Vencidos.Nombre Grupo Estadistico4")}
            /> 
            <Scrolling />
            <Paging defaultPageSize={10} />
            <Export enabled={true} allowExportSelectedData={true} />
            <Summary calculateCustomSummary={this.calculateSelectedRow} visible={true}>
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                displayFormat='Total: {0}'
                showInColumn={Translate("Vencidos.Cla Pedido")}
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
