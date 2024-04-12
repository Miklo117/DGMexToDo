import React from 'react';
import { config } from '../../utils/config';
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import { callApi, setSessionData, getSessionItem, Translate } from '../../utils/utils';
import CtrlTreeViewComboBox from 'components/Controls/CtrlTreeviewComboBox';
import { Button } from 'devextreme-react/button';

export default class FiltrosOrganizaciones extends React.Component{
    render(){
        return(
          <>
            <Row>
              <Col md={{ size: 6 }} style={{ textAlign: 'center' }}>
                <CtrlTreeViewComboBox
                  dataSource={this.state.source} 
                  onTreeViewCallback={this.getSubElements} 
                  selectionMode="single" 
                  checkBoxesMode="none"
                  default={1}
                  blockedLevels={[2]}
                  displayExpr="name"
                  keyExpr="ID"
                  createChildren={this.createChildren}
                >
                </CtrlTreeViewComboBox>
              </Col>
              <Col md={{ size: 6 }} style={{ textAlign: 'center' }}>
                <Button text={Translate("Organizaciones.BtnAgregar.Text")} onClick={this.agregarArticuloOnClick} disabled={this.state.agregarDisabled} />
              </Col>
            </Row>
            <Row>
              <Col md={{ size: 6, offset:6 }} style={{ textAlign: 'center' }}>
                <Button className="mb-2 mt-1 ml-4" disabled={false} text={Translate("Organizaciones.BtnGuardar.Text")} onClick={this.guardarAgrupacionArticulosOnClick} />
              </Col>
            </Row>
          </>
        );
    }
}