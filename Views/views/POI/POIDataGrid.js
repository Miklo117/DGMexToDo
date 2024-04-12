/* eslint-disable react/jsx-no-undef */

import React, {useMemo} from 'react';

import { Row, Col, Spinner } from 'reactstrap';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import DataGrid, { Export, Scrolling, Paging, TotalItem, Column } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { callApi, callKrakenApi, languageInit, Translate } from '../../utils/utils';

export default class POIDataGrid extends React.Component {
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
    
    this.onExporting = this.onExporting.bind(this);
  }

  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(this.props.month);

    exportDataGrid({
      component: e.component,
      autoFilterEnabled: true,
      worksheet
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }),`POI ${this.props.year} ${this.props.month}.xlsx`);
      });
    });
    e.cancel = true;
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
            id="POIDataGrid"
            dataSource={this.props.dataSource}
            showBorders={true}
            columnAutoWidth={true}
            onExporting={this.onExporting}
          >
            <Column
              dataField="descripcion"
              caption={Translate("Pivot.Nombre")}
            />
            <Column
              dataField="cumplimientoOferta"
              caption={Translate("Pivot.CumplimientoOferta")}
            />
            <Column
              dataField="calidadEntrega"
              caption={Translate("Pivot.CalidadEntrega")}
            />
            <Column
              dataField="calidadFactura"
              caption={Translate("Pivot.CalidadFactura")}
            />
            <Column
              dataField="poi"
              caption={Translate("Pivot.POI")}
            />

            <Scrolling />
            <Paging defaultPageSize={10} />
            <Export enabled={true} allowExportSelectedData={false} />
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
