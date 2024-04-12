/* eslint-disable no-useless-constructor */
import React from 'react';
import DataGrid, { Column, Paging, Editing, Selection } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Row, Col } from 'reactstrap';
import { config } from '../../utils/config';
import { callApi, Translate } from '../../utils/utils';
import renderAgrupacionGridCheckbox from './renderAgrupacionGridCheckbox.js';
import renderEditAgrupacionGridCheckbox from './renderEditAgrupacionGridCheckbox.js';

import { Route, Router, Redirect } from 'react-router-dom';
// import POI from '../POI/POI.js';

export default class OrganizacionesGrid extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <>
        <DataGrid
          id="gridOrganizaciones"
          height={600}
          selection={{ mode: 'single' }}
          showBorders={false}
          columnHidingEnabled
          columnAutoWidth={false}
          showColumnHeaders
          showColumnLines={false}
          showRowLines
          noDataText={Translate("Organizaciones.AgrupadorGrid.noDataText")}
          wordWrapEnabled
          rowAlternationEnabled={false}
          dataSource={this.props.dataSource}
          onRowUpdating={this.props.onRowUpdated}
        >
          <Editing
            mode="row"
            allowUpdating={true}
            useIcons={true}
          />
          <Column type="buttons" width="30px">
            <Button name="edit" />
          </Column>
          <Column 
            dataField="ClaOrganizacion" 
            width="30px"
            caption={Translate("Organizaciones.AgrupadorGrid.Clave")}
          >                
          </Column>
          <Column 
            dataField="NomOrganizacion" 
            width="60px"
            caption={Translate("Organizaciones.AgrupadorGrid.Descripcion")}
          >                
          </Column>
          <Column 
            dataField="BajaLogica" 
            caption={Translate("Organizaciones.AgrupadorGrid.Baja")}
            cellComponent={renderAgrupacionGridCheckbox}
            editCellComponent={renderEditAgrupacionGridCheckbox}
          >                
          </Column>
        </DataGrid>
      </>
    );
  }
}