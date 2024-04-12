/* eslint-disable dot-notation */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-const */
/* eslint-disable import/named */
/* eslint-disable react/jsx-indent */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
import React, { useRef } from 'react';
import DataGrid, { Column, Paging, Editing, Selection } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Row, Col } from 'reactstrap';
import { supported } from 'assets/vendor/quill/dist/quill.core';
import { config } from '../../utils/config';
import { callApi2, languageInit, Translate } from '../../utils/utils';
import { CheckBox } from 'devextreme-react';
import { on } from 'devextreme/events';
import renderEditGridCellCheckBox from './renderGridCellCheckBox.js'
import renderArticuloGridCheckBox from './renderArticuloGridCheckBox.js'

import { Route, Router, Redirect } from 'react-router-dom';
// import POI from '../POI/POI.js';

const renderGridCellCheckbox = (data) => {
  return <CheckBox disabled={true} defaultValue={data.key.bajaLogica} />
}

const renderArticuloCellCheckbox = (data) => {
  return <CheckBox disabled={false} defaultValue={data.key.bajaLogica} />
}

export default class ArticulosGrid extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      agrupacionDataSource : [],
      selectedAgrupacion: {},
      guardarState: true
    };
  }

  onRowInserted = e => {
    const urlApiService = `${config.UrlApiProject}agrupador/`;

    const data = {
      "ClaveArticulo" : e.data.claAgrupadorOrganizacion === undefined ? 0 : e.data.claAgrupadorOrganizacion,
      "Descripcion" : e.data.nomAgrupadorOrganizacion,
      "BajaLogica" : e.data.bajaLogica === undefined ? 0 : e.data.bajaLogica
    }
    
    callApi2(`${urlApiService}insert`, 'POST', data).then( (result) => {
      this.setState({
        agrupacionDataSource: result.data
      });
    });
  }

  onRowUpdated = e => {

    var oldData = e.oldData;
    // oldData[Object.keys(e.newData)[0]] = e.newData[Object.keys(e.newData)[0]];

    Object.keys(e.newData).forEach((element,index) => {
      oldData[element] = e.newData[element]  
      }
    )

    const newData = {
      "ClaveArticulo" : oldData.claAgrupadorOrganizacion,
      "Descripcion" : oldData.nomAgrupadorOrganizacion,
      "BajaLogica" : oldData.bajaLogica
    }

    const urlApiService = `${config.UrlApiProject}agrupador/`;

    callApi2(`${urlApiService}update`, 'PUT', newData).then( (result) => {
      this.setState({
        agrupacionDataSource: result.data,
        modifiedBaja: {isModified: false, value: 0}
      });
    }); 

    const urlApiServiceGet = `${config.UrlApiProject}agrupador/agrupadores`;

    callApi2(urlApiServiceGet, 'GET', {}).then( (result) => {
      this.setState({
        agrupacionDataSource: result.data
      });
    });
  }

  onRowDblClick = e =>{
    const urlApiService = `${config.UrlApiProject}articulo/`;

    const data = {
      "ClaveArticulo" : e.values[1],
      "Descripcion" : "",
      "BajaLogica" : 0
    }

    callApi2(`${urlApiService}agrupadorarticulos?id=${data.ClaveArticulo}`, 'GET', {}).then( (result) => {
      this.setState({
        articulosDataSource: result.data
      })
    });

    this.setState({
      selectedAgrupacion : e.values[1]
    });

    this.props.setSelectedRow({
      "claveAgrupador" : e.values[1], 
      "descripcionAgrupador": e.values[2]
    })
  }
  
  componentDidMount()
  {
    const urlApiService = `${config.UrlApiProject}agrupador/agrupadores`;

    callApi2(urlApiService, 'GET', {}).then( (result) => {
      this.setState({
        agrupacionDataSource: result.data
      });
    });

    this.props.setCallables({
      setNewArticulo: this.setNewArticulo
   });
  }

  setNewArticulo = (newItem) => {
    // Get the event from parent
    // console.log(this.state.articulosDataSource);
    
    if(this.state.articulosDataSource !== undefined)
    {
      this.setState(prevState => ({
        articulosDataSource: [...prevState.articulosDataSource, newItem]
      }))
    }

    this.setState({
      newArticulo: newItem
    });
  }

  guardarAgrupacionArticulosOnClick = (e) =>
  {
    console.log(this.state.articulosDataSource);

    const urlApiService = `${config.UrlApiProject}articulo/agregararticulo`;

    callApi2(urlApiService, 'POST', this.state.articulosDataSource).then( (result) => {

      callApi2(`${config.UrlApiProject}agrupador/agrupadores`, 
      'GET', {}).then( (resultAgr) => {
        this.setState({
          articulosDataSource: result.data,
          agrupacionDataSource: resultAgr.data
        });
      });
    });
  }

  render(){
    languageInit();
    this.props.selectedAgrupadorCallBack(this.state.selectedAgrupacion);

    let  gridContent = (<></>);
    callApi2(`${config.UrlApiProject}usuario/permisos`, 'POST', {}).then( (result) => {
      if(!result.data.includes("permisos"))
      {
        
        gridContent = (
          <>
            <Router history={this.props.history}>
              <Redirect to="../" />
            </Router>
          </>
        )
      }
    });
    gridContent = (
      <Row>
        <Col md={{ size: 6, offset: 0}} style={{ textAlign: 'center', maxWidth:'auto' }}>
          <Row>
            <Col>
              <br />
              <br />
            </Col>
          </Row>
          <Row>
            <DataGrid
              id="gridPedidos"
              height={600}
              selection={{ mode: 'single' }}
              showBorders={false}
              columnHidingEnabled
              columnAutoWidth={false}
              showColumnHeaders
              showColumnLines={false}
              showRowLines
              noDataText={Translate("Articulos.AgrupadorGrid.noDataText")}
              wordWrapEnabled
              rowAlternationEnabled={false}
              dataSource={this.state.agrupacionDataSource}
              onRowInserted={this.onRowInserted}
              onRowValidating={this.onRowUpdated}
              onRowDblClick={this.onRowDblClick}
            >
              <Editing
                mode="row"
                allowUpdating={true}
                allowAdding={true} 
                useIcons={true}
              />
              
              <Column type="buttons" width="50px">
                <Button name="edit" />
              </Column>
              <Column dataField="claAgrupadorOrganizacion" caption={Translate("Articulos.AgrupadorGrid.Clave")} allowEditing={false} />
              <Column dataField="nomAgrupadorOrganizacion" caption={Translate("Articulos.AgrupadorGrid.Descipcion")} width="100px" />
              <Column 
                dataField="bajaLogica" 
                caption={Translate("Articulos.AgrupadorGrid.Baja")}
                editCellComponent={renderEditGridCellCheckBox}
                cellRender={renderGridCellCheckbox}
              >
              </Column>
            </DataGrid>
          </Row>
        </Col>
        <Col md={{ size: 6, offset: 0}} style={{ textAlign: 'center' }}>
          <Row>
            <Col md={{ size: 4, offset: 7 }}>
              <Button className="mb-2 mt-1 ml-4" disabled={false} text={Translate("Articulos.BtnGuardar.Text")} onClick={this.guardarAgrupacionArticulosOnClick} />
            </Col>
          </Row>
          <Row>
            <Col>
              <DataGrid
                id="gridPedidos"
                height={600}
                selection={{ mode: 'single' }}
                showBorders={false}
                columnHidingEnabled
                columnAutoWidth={false}
                dataSource={this.state.articulosDataSource}
                showColumnHeaders
                showColumnLines={false}
                showRowLines
                noDataText={Translate("Articulos.ArticuloGrid.noDataText")}
                wordWrapEnabled
                rowAlternationEnabled={false}
              >
                <Column dataField="nomOrganizacion" width="60px" caption={Translate("Articulos.ArticuloGrid.Clave")} />
                <Column 
                  dataField="bajaLogica" 
                  caption={Translate("Articulos.ArticuloGrid.Baja")} 
                  cellComponent={renderArticuloGridCheckBox}
                />
              </DataGrid>
            </Col>
          </Row>            
        </Col>          
      </Row>
    )
    return gridContent;
  }
}
