/* eslint-disable spaced-comment */
/* eslint-disable no-debugger */

import React from 'react';

import POIDataGrid from './POIDataGrid';

import { Row, Col } from 'reactstrap';
import { TreeList, Column } from 'devextreme-react/tree-list';

import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { languageInit, Translate } from '../../utils/utils';
import { Height } from 'devextreme-react/chart';

export default class POITreeList extends React.Component {
  
  constructor(props) {
    super(props);
    this._pivotGrid = React.createRef();
    const self = this;
    this.onCellClick = this.onCellClick.bind(this);


    this.state = {
      CurrentRow: 0,
      CurrentColumn: 0,
      HeaderRow: 0,
      totalRows: 0,
      totalColumns: 0,
      counter: 0,
      mostrados: [],
      pedidosCumplidos: [],
      totalPedidos: [],
      treeData:  this.props.dataSource
    };

    
    this.treeSegment = this.treeSegment.bind(this);

    
  }

  onYearHeaderRender(cellInfo){
    console.log(cellInfo);
  }

  onCellClick(e){
    this.props.onCellClick(e);
  }
  
  customizeText(cellInfo){
    if(cellInfo.value === 'TotalEmpresa'){
      self.setState({
        HeaderRow: self.state.CurrentRow
      });
      cellInfo.valueText = '<h5>Total Empresa</h5>';
      cellInfo.value = 'Total Empresa';
    }
    this.state.CurrentRow++;
    if(self.state.CurrentRow === self.state.totalRows) self.state.CurrentRow = 0;
    return cellInfo.value;
  }

  onExporting(e) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('POI');
    

    exportPivotGrid({
      component: e.component,
      worksheet,
      customizeCell: ({ pivotCell, excelCell }) => {

        const isDataCell =(cell)=> {
          return (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');
        }
    
        const isTotalCell=(cell) =>{
          return (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');
        }
        const getExcelCellFormat=({ fill, font, bold })=>{
          return {
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } },
            font: { color: { argb: font }, bold }
          };
        }

        if (isDataCell(pivotCell) || isTotalCell(pivotCell)) {
            if(pivotCell.value!==undefined){
              const color = "34b53a"; // : partida[columnName] === 20 ? "ffb200" : "ff3a29";
              const params={
                value: pivotCell.value,
                // font: { color: { argb: color }, underline: true },
                // fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } },
                // border: { bottom: borderStyle, left: borderStyle, right: borderStyle, top: borderStyle },
                // alignment: { horizontal: alinear }
              }
              Object.assign(excelCell, params);
              // excelCell.value = pivotCell.value;
            }
        }
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { 
          type: 'application/octet-stream' 
        }), 'POI.xlsx');
      });
    });
    e.cancel = true;
  }
  
  treeSegment(fecha, data){
    const css = `
    #POIDataGrid .dx-datagrid-headers.dx-datagrid-nowrap {
        height: 1px;
        margin: 0;
        padding: 0;
        border: none !important;
    }
    #POIDataGrid .dx-datagrid-rowsview.dx-datagrid-nowrap.dx-last-row-border.dx-scrollable.dx-visibility-change-handler.dx-scrollable-both.dx-scrollable-simulated {
      height: 0;
      margin: 0;
      padding: 0;
      border: none !important;
    }
    #POIDataGrid .dx-datagrid-pager.dx-pager {
      height: 0;
      margin: 0;
      padding: 0;
      border: none !important;
    }
    `;
    const segmentResult = (
      <Row>
        <Col md={{size: 12}}>
          <hr />
          <h3>{Translate(`Months`)[fecha-1]}</h3>
          <POIDataGrid dataSource={data} visible={true} month={Translate(`Months`)[fecha-1]} year={data[0].header} />
          <TreeList
            dataSource={data}
            columnAutoWidth={true}
            showRowLines={true}
            rootValue={-1}
            showBorders={true}
            defaultExpandedRowKeys={[1]}
            keyExpr="id"
            parentIdExpr="padre"
            onCellDblClick={this.onCellClick}
          >
            <Column dataField="descripcion" caption="Descripción" />
            <Column dataField="cumplimientoOferta" caption={Translate('Pivot.CumplimientoOferta')} />
            {/* <Column dataField="noStockout" caption={Translate('Pivot.NoStockout')} /> */}
            <Column dataField="calidadEntrega" caption={Translate('Pivot.CalidadEntrega')} />
            <Column dataField="calidadFactura" caption={Translate('Pivot.CalidadFactura')} />
            <Column dataField="poi" caption={Translate('Pivot.POI')} />
          </TreeList>
        </Col> 
        <style>{css}</style>
      </Row>
    )
    return segmentResult;
  }

  // componentDidUpdate(prevProps){

  //   this.setState({
  //     treeData: this.props.dataSource
  //   });
  //   // if(prevProps.dataSource !== this.props.dataSource){
  //   //   this.forceUpdate()
  //   // }
  // }
  
  componentDidMount() {
  }

  render() {
    languageInit();
      for(let i = 0; i < this.state.treeData.length; i++){
        const mes = this.state.treeData[i];
        mes.fecha;
        mes.data;
      }
    const gridContent = (
      <>
        {this.state.treeData.map((mes, i) => this.treeSegment(mes.fecha, mes.data))}
      </>
    );

    return (
      <>
        {gridContent}
      </>
    );
  }

  
}