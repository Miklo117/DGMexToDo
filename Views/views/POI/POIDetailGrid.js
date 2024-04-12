
import React, {useMemo} from 'react';

import { Row, Col, Spinner } from 'reactstrap';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { callApi, callKrakenApi, languageInit, Translate } from '../../utils/utils';
import DataGrid, { Export, Scrolling, Paging, Summary, TotalItem } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { config } from '../../utils/config';

export default class POIDetailGrid extends React.Component {
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
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component,
      autoFilterEnabled: true,
      worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),`Detail.xlsx`);
      });
    });
    e.cancel = true;
  }

  calculateSelectedRow(options) {
    if (options.summaryProcess === 'start') {
      options.totalValue = "";
    } 
    else if (options.summaryProcess === 'calculate') {

      switch(this.props.summaryTitle){
        case "No Stockout":
          if(options.value.CumpleLineFillRate === "SI")
            this.setState({acceptedTotal: this.state.acceptedTotal+1});
            options.totalValue = `${this.props.summaryTitle}: ${this.state.acceptedTotal}/${this.state.totalRows}`;
          break;

        case "Cumple Calidad Entrega":
          if(options.value.CumpleQualityDelivery === "SI")
            this.setState({acceptedTotal: this.state.acceptedTotal+1});
            options.totalValue = `${this.props.summaryTitle}: ${this.state.acceptedTotal}/${this.state.totalRows}`;
          break;

        case "Cumplio Entrega Cliente":
          if(options.value.CumplioEntregaCliente === "SI")
            this.setState({acceptedTotal: this.state.acceptedTotal+1});
            options.totalValue = `${this.props.summaryTitle}: ${this.state.acceptedTotal}/${this.state.totalRows}`;
          break;

        case "Cumple Calidad Factura":
          if(options.value.CumpleQIPedidoSN === "SI")
            this.setState({acceptedTotal: this.state.acceptedTotal+1});
            options.totalValue = `${this.props.summaryTitle}: ${this.state.acceptedTotal}/${this.state.totalRows}`;
          break;

        case "Cumple Line Fill Rate":
          if(options.value.CumpleLineFillRate === "SI")
            this.setState({acceptedTotal: this.state.acceptedTotal+1});
            options.totalValue = `${this.props.summaryTitle}: ${this.state.acceptedTotal}/${this.state.totalRows}`;
          break;

        default:
          break;
      }


      this.setState({totalRows: this.state.totalRows+1});
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
            defaultColumns={columns}
            id="grid"
            dataSource={this.props.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            onExporting={this.onExporting}
          >
            <Scrolling />
            <Paging defaultPageSize={10} />
            <Export enabled={true} allowExportSelectedData={true} />
            <Summary calculateCustomSummary={this.calculateSelectedRow} visible={this.props.summaryVisible}>
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                displayFormat="{0}"
                showInColumn="ClaPedido" 
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
