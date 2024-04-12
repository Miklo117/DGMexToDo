/* eslint-disable spaced-comment */
/* eslint-disable no-debugger */

import React from 'react';

import { Row, Col } from 'reactstrap';
import { PivotGrid, Export } from 'devextreme-react/pivot-grid';

import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { languageInit, Translate } from '../../utils/utils';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

export default class POIGrid extends React.Component {
  
  constructor(props) {
    super(props);
    this._pivotGrid = React.createRef();
    const self = this;
    this.state = {
      CurrentRow: 0,
      CurrentColumn: 0,
      HeaderRow: 0,
      totalRows: 0,
      totalColumns: 0,
      counter: 0,
      mostrados: [],
      pedidosCumplidos: [],
      totalPedidos: []
    };

    
    this.onCellClick = this.onCellClick.bind(this);
    this.onYearHeaderRender = this.onYearHeaderRender.bind(this);

    this.calculateCumplimientoOfertaCustomSummary = this.calculateCumplimientoOfertaCustomSummary.bind(this);
    this.calculateNoStockoutCustomSummary = this.calculateNoStockoutCustomSummary.bind(this);
    this.calculateCalidadEntregaCustomSummary = this.calculateCalidadEntregaCustomSummary.bind(this);
    this.calculateCalidadFacturaCustomSummary = this.calculateCalidadFacturaCustomSummary.bind(this);
    this.calculatePoiCustomSummary = this.calculatePoiCustomSummary.bind(this);

    this.dataGrid = null;
    
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
  
  getConditionalAppearance(cell) {
    if(isTotalCell(cell)) {
      return { fill: 'F2F2F2', font: '3F3F3F', bold: true };
    } 

    const { value } = cell;
    if(value < 20000) {
      return { font: '9C0006', fill: 'FFC7CE' };
    }

    if(value > 50000) {
      return { font: '006100', fill: 'C6EFCE' };
    }

    return { font: '9C6500', fill: 'FFEB9C' };
  }

  customizeCells(e) { 
    if(e.area === 'column'){
      if(e.cellElement.children[0].className === 'dx-expand-icon-container')
        e.cellElement.removeChild(e.cellElement.children[0]);
    }
    if(e.area === 'data'){     
      if(e.cell.rowPath[0] === '<h5>Total Empresa</h5>' || e.cell.rowPath[0] === 'TotalEmpresa') {
        e.cellElement.style.fontWeight = 'bold';
        e.cell.value = ((Math.round(e.cell.value * 100))/100).toFixed(2);
        e.cell.text = ((Math.round(e.cell.value * 100))/100).toFixed(2);
      }
      else{
        e.cellElement.style.fontWeight = 'bold';
        // e.cellElement.style.textDecoration  = e.cell.text !== '' ? 'underline' : '';
        e.cellElement.style.cursor = 'pointer';
      }
    }
    else if(e.area === 'row'){ 
      if(e.cell.text === '<h5>Total Empresa</h5>' || e.cell.text === 'Total Empresa'){
        e.cell.text = '<h5>Total Empresa</h5>';
        e.cellElement.style.fontWeight = 'bold';
        e.cellElement.style.cursor = 'pointer';
        e.cellElement.style.fontSize = '11pt';
      }
    }
  };

  customizeDataCellTextHeader(cellInfo){
    if(cellInfo.value === 'TotalEmpresa'){
      cellInfo.valueText = '<h5>Total Empresa</h5>';
      cellInfo.value = '<h5>Total Empresa</h5>';
    }

    return cellInfo.valueText;
  }

  customizeDataCellText(cellInfo){
    cellInfo.value = (cellInfo.value*1).toFixed(2);
    if(cellInfo.value === 'NaN') cellInfo.value = '';
    return cellInfo.valueText;
  }

  calculateCumplimientoOfertaCustomSummary(options){
    if (options.summaryProcess === 'start') {
      options.totalValue = 0;
      options.sumValue = 0;
      options.totalPedidos = 0;
      options.id = 0
    }
    if (options.summaryProcess === 'calculate') {
      if(options.value.descripcion !== "Bodegas Virtuales"){
        options.totalPedidos += options.value.totalPedidos + options.value.pedidosVencidos;
        options.sumValue += options.value.pedidosCumplidos;
      }
      options.id++;
      options.result = (options.value.pedidosCumplidos/(options.value.totalPedidos + options.value.pedidosVencidos)*100).toFixed(2);
      // options.result = options.value.cumplimientoOferta;
    }
    if (options.summaryProcess === 'finalize') {
      // options.totalValue = (options.sumValue / options.totalPedidos*100).toFixed(2);
      if(options.id > 1){
        options.result = (options.sumValue/options.totalPedidos*100).toFixed(2);
        if(options.result === 'NaN') options.result = '';
      }
      options.totalValue = options.result;
    }
  }

  calculateNoStockoutCustomSummary(options){
    switch(options.summaryProcess) {
        case 'start':
          options.totalValue = 0;
          options.sumValue = 0;
          options.totalArticulos = 0;
          options.id = 0
          break;
        case 'calculate':
          options.sumValue += options.value.noStockOutCumplidos;
          options.totalArticulos += options.value.totalArticulos;
          options.id++;
          // options.result = (options.value.pedidosCumplidos/options.value.totalPedidos*100).toFixed(2);
          options.result = options.value.noStockout;
          break;
        case 'finalize':
          if(options.id > 1){
            options.result = (options.sumValue/options.totalArticulos*100).toFixed(2);
            if(options.result === 'NaN') 
              options.result = 0;
          }
          options.totalValue = options.result;
          break;
        default:
          break;
    }
  }

  calculateCalidadEntregaCustomSummary(options){
    switch(options.summaryProcess) {
      case 'start':
        options.totalValue = 0;
        options.sumValue = 0;
        options.totalPedidos = 0;
        options.id = 0
        break;
      case 'calculate':
        options.sumValue += options.value.calidadEntregaCumplidos;
        options.totalPedidos += options.value.totalPedidos;
        options.id++;
        // options.result = (options.value.pedidosCumplidos/options.value.totalPedidos*100).toFixed(2);
        options.result = options.value.calidadEntrega;
        break;
      case 'finalize':
        if(options.id > 1){
          options.result = (options.sumValue/options.totalPedidos*100).toFixed(2);
          if(options.result === 'NaN') options.result = '';
        }
        options.totalValue = options.result;
        break;
      default:
        break;
    }
  }

  calculateCalidadFacturaCustomSummary(options){
    switch(options.summaryProcess) {
      case 'start':
        options.totalValue = 0;
        options.sumValue = 0;
        options.totalPedidos = 0;
        options.id = 0
        break;
      case 'calculate':
        options.sumValue += options.value.calidadFacturaCumplidos;
        options.totalPedidos += options.value.totalPedidos;
        options.id++;
        options.result = (options.value.pedidosCumplidos/options.value.totalPedidos*100).toFixed(2);
        options.result = options.value.calidadFactura;
        break;
      case 'finalize':
        if(options.id > 1){
          options.result = (options.sumValue/options.totalPedidos*100).toFixed(2);
          if(options.result === 'NaN') options.result = '';
        }
        options.totalValue = options.result;
        break;
      default:
        break;
    }
  }

  calculatePoiCustomSummary(options){
    switch(options.summaryProcess) {
        case 'start':
          options.totalValue = 0;
          
          options.totalValue = 0;
          options.count = 0;
          break;
        case 'calculate':
          options.totalValue += options.value.calidadFactura;
          options.count ++;
          break;
        case 'finalize':
          options.totalValue /= options.count;
          options.totalValue = ((Math.round(options.totalValue * 100))/100).toFixed(2)
          return options.totalValue;
        default:
          break;
    }
  }

  componentDidMount() {

  }
 
  render() {
    languageInit();

    const gridContent = (
      <Row>
        <Col md={{size: 12}}>
          <PivotGrid
            dataSource={this.pivotData(this.props.dataSource)} 
            allowSorting={true}
            showColumnTotals={false}
            allowFiltering={true}
            height={620}
            showBorders={true}
            rowHeaderLayout="tree"
            showRowTotals={true}
            showRowGrandTotals={true}
            showColumnGrandTotals={false}
            encodeHtml={false}
            ref={(ref) => this.dataGrid = ref}
            onCellPrepared={this.customizeCells}
            onExporting={this.onExporting}
            onCellClick={this.onCellClick}
          >
            <Export enabled={true} />
          </PivotGrid>
        </Col>
      </Row>
    );

    return (
      <>
        {gridContent}
      </>
    );
  }

  pivotData(data){
    const datasource= new PivotGridDataSource({
      store: data,
      fields: [{
        caption: 'Nombre',
        dataField: 'descripcion',
        width: 150,
        area: 'row',
        customizeText: (cellInfo) => {
          // console.log(this.rowPath);
          return this.customizeDataCellTextHeader(cellInfo);
        },
      }, {
        caption: Translate('Pivot.Anio'),
        dataField: 'header',
        dataType: 'string',
        expanded: true,
        area: 'column',
        cellRender: (cellInfo)=>{ return this.onYearHeaderRender(cellInfo) },
      }, {
        caption: Translate(`Pivot.Mes`),
        dataField: 'mes',
        expanded: true,
        area: 'column',
        dataType: 'string',
        customizeText: (cellInfo) => {
          cellInfo.valueText = Translate(`Months`)[cellInfo.value-1];
          console.log(cellInfo);
          return cellInfo.valueText;
        },
        filterType: 'include', //controla filtro de mes
        filterValues: this.props.mesIncluded//[8, 9]
      }, {
        caption: Translate('Pivot.CumplimientoOferta'),
        // dataField: 'cumplimientoOferta',
        // summaryType: 'avg',
        summaryType: 'custom',
        calculateCustomSummary: (options) =>{return this.calculateCumplimientoOfertaCustomSummary(options);},
        customizeText: (cellInfo) => {
          // console.log(this.rowPath);
          return this.customizeDataCellText(cellInfo);
        },
        cellRender: (cellInfo)=>{ return this.onCellRender(cellInfo) },
        area: 'data',
      }, {
        caption: Translate('Pivot.NoStockout'),
        // dataField: 'noStockout',
        // summaryType: 'avg',
        summaryType: 'custom',
        calculateCustomSummary: (options) =>{return this.calculateNoStockoutCustomSummary(options);},
        customizeText: (cellInfo) => {
          return this.customizeDataCellText(cellInfo);
        },
        area: 'data'
      }, {
        caption: Translate('Pivot.CalidadEntrega'),
        // dataField: 'calidadEntrega',
        // summaryType: 'avg',
        summaryType: 'custom',
        calculateCustomSummary: (options) =>{return this.calculateCalidadEntregaCustomSummary(options);},
        customizeText: (cellInfo) => {
          return this.customizeDataCellText(cellInfo);
        },
        area: 'data'
      }, {
        caption: Translate('Pivot.CalidadFactura'),
        // dataField: 'calidadFactura',
        // summaryType: 'avg',
        summaryType: 'custom',
        calculateCustomSummary: (options) =>{return this.calculateCalidadFacturaCustomSummary(options);},
        customizeText: (cellInfo) => {
          return this.customizeDataCellText(cellInfo);
        },
        area: 'data'
      }, {
        caption: Translate('Pivot.POI'),
        dataField: 'poi',
        // summaryType: 'avg',
        summaryType: 'custom',
        calculateSummaryValue: (summaryCell) => {

          const CO = summaryCell.value(Translate('Pivot.CumplimientoOferta'),true)
          const NSO = summaryCell.value(Translate('Pivot.NoStockout'),true)
          const CE = summaryCell.value(Translate('Pivot.CalidadEntrega'),true)
          const CF = summaryCell.value(Translate('Pivot.CalidadFactura'),true)
          const result = (CO * NSO * CE * CF / 1000000).toFixed(2);
          if(result === 'NaN') return ''
          return  result;
        },
        area: 'data'
      }, {
        caption: Translate('Pivot.pedidosCumplidos'),
        dataField: 'pedidosCumplidos',
        summaryType: 'sum',
        area: 'data'
      }, {
        caption: Translate('Pivot.NoStockOutCumplidos'),
        dataField: 'noStockOutCumplidos',
        summaryType: 'sum',
        area: 'data'
      }, {
        caption: Translate('Pivot.calidadFacturaCumplidos'),
        dataField: 'calidadFacturaCumplidos',
        summaryType: 'sum',
        area: 'data'
      }, {
        caption: Translate('Pivot.calidadEntregaCumplidos'),
        dataField: 'calidadEntregaCumplidos',
        summaryType: 'sum',
        area: 'data'
      }, {
        caption: Translate('Pivot.pedidosVencidos'),
        dataField: 'pedidosVencidos',
        summaryType: 'sum',
        area: 'data'
      }, {
        caption: Translate('Pivot.totalPedidos'),
        dataField: 'totalPedidos',
        summaryType: 'sum',
        area: 'data'
      }, {
        caption: Translate('Pivot.totalArticulos'),
        dataField: 'totalArticulos',
        summaryType: 'sum',
        area: 'data'
      }, {
        caption: Translate('Pivot.Mostrar'),
        dataField: 'mostrar',
        filterType: 'include',
        filterValues: [true],
        area: 'filter'
      }]
    });
  
    datasource.collapseHeaderItem('column', ['Anual']);
    return datasource; 
  }
}