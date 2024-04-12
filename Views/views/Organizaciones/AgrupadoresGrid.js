/* eslint-disable no-useless-constructor */
import React from 'react';
import DataGrid, { Column, Paging, Editing, Selection } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Row, Col } from 'reactstrap';
import { config } from '../../utils/config';
import { callApi, Translate } from '../../utils/utils';
import renderAgrupacionGridCheckbox from './renderAgrupacionGridCheckbox.js';
import renderEditAgrupacionGridCheckbox from './renderEditAgrupacionGridCheckbox.js';

export default class AgrupadoresGrid extends React.Component{
    constructor(props){
      super(props);
    }

    render(){
        return(
          <>
            <DataGrid
              id="gridAgrupadores"
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
              onRowInserted={this.props.onRowInserted}
              onRowUpdating={this.props.onRowUpdated}
              onRowDblClick={this.props.onRowDblClick}
            >
              <Editing
                mode="row"
                allowUpdating={true}
                allowAdding={true} 
                useIcons={true}
              />
              <Column type="buttons" width="30px">
                <Button name="edit" />
              </Column>
              <Column 
                dataField="ClaAgrupadorOrganizacion" 
                width="20px"
                caption={Translate("Organizaciones.AgrupadorGrid.Clave")}
              >
              </Column>
              <Column 
                dataField="NomAgrupadorOrganizacion" 
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