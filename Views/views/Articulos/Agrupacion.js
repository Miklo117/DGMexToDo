/* eslint-disable radix */
/* eslint-disable prefer-const */
import React from 'react';
import AppContext from "../../context/AppContext";
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import CtrlNumerico from 'components/Controls/CtrlNumerico';
import CtrlTextBox from 'components/Controls/CtrlTextBox';
import CtrlTreeViewComboBox from 'components/Controls/CtrlTreeviewComboBox';
import CtrlArticulosTreView from 'components/Controls/CtrlArticulosTreView';
import ArticulosGrid from './ArticulosGrid';
import { element } from 'prop-types';
import { config } from '../../utils/config';
import { callApi, setSessionData, getSessionItem, languageInit, Translate, callKrakenApi } from '../../utils/utils';
import { Button } from 'devextreme-react/button';

export default class Agrupacion extends React.Component{
    constructor(props) {
      super(props);

      this.state = {
        source: [],
        agregarDisabled: true,
        selectedItem: "",
        selectedItemToSave: "",
        mounted: false,
        claveAgrupador: "0000",
        descripcionAgrupador: "0000"
      };

      this.toggleDisabled = this.toggleDisabled.bind(this);
    }

    toggleDisabled = () => {
      this.setState({
        agregarDisabled: false
      })
    }

    getSubElements =(e) => {

      let newObj = {
        bajaLogica: 0,
        claAgrupadorOrganizacion: this.state.selectedAgrupador,
        claOrganizacionPadre: parseInt(Number.isInteger(e[0].key) ? e[0].key : e[0].key.split('_')[2]),
        claOrganizacion: Number.isInteger(e[0].key) ? e[0].key : parseInt(e[0].key.split('_').length === 3 ? 
          e[0].key.split('_')[2] : e[0].key.split('_')[3]),
        claNivelFiltro: Number.isInteger(e[0].key) ? e[0].key : parseInt(e[0].key.split('_').length) - 1,
        claTipoArticulo: Number.isInteger(e[0].key) ? e[0].key : parseInt(e[0].key.split('_')[1]),
        nomOrganizacion: e[0].text
      }

      this.setState({
        selectedItem: newObj,
        agregarDisabled: false
      });
    }

    getSelectedArticulo = (e) =>{

    }

    agregarArticuloOnClick = (e) =>{
      this.setState({
        selectedItemToSave: this.state.selectedItem
      });

      this.childCallables.setNewArticulo(this.state.selectedItem);
    }
    
    getselectedAgrupador = (d) =>{
      if(typeof d === "number"){
        // eslint-disable-next-line prefer-template
        this.state.selectedAgrupador = d;
      }
    }

    addNewArticulo = (callables) =>{
      this.childCallables = callables;
    }

    childCallables = null;

    setSelectedRow = (row) =>{
      this.setState({
        claveAgrupador: row.claveAgrupador,
        descripcionAgrupador: row.descripcionAgrupador
      });
    }

    createChildren = (row) =>{

    }

    componentDidMount(){
      this.setState({
        agregarDisabled: true,
        mounted: true
      });
    }

    render(){
      languageInit();
      return (
        <>
          <div className="content">
            <Card>
              <CardHeader>
                <Row>
                  <Col>
                    <CardTitle tag="h4">{Translate('Articulos.Header.Title')}</CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={{ size: 2 }} style={{ textAlign: 'center' }}>
                    <div>{Translate('Articulos.Header.ClaveAgrupador')}:</div><div>{this.state.claveAgrupador}</div>
                  </Col>
                  <Col md={{ size: 2 }} style={{ textAlign: 'center' }}>
                    <div>{Translate('Articulos.Header.Descripcion')}:</div><div>{this.state.descripcionAgrupador}</div>
                  </Col>
                  <Col md={{ size: 6 }} style={{ textAlign: 'center' }}>
                    <CtrlArticulosTreView
                      onTreeViewCallback={this.getSubElements}
                    >
                    </CtrlArticulosTreView>
                  </Col>
                  <Col md={{ size: 2 }}>
                    <Button text={Translate("Articulos.BtnAgregar.Text")} onClick={this.agregarArticuloOnClick} disabled={this.state.agregarDisabled} />
                  </Col>
                </Row>
                <ArticulosGrid selectedAgrupadorCallBack={this.getselectedAgrupador} setCallables={this.addNewArticulo} setSelectedRow={this.setSelectedRow}>
                </ArticulosGrid>
              </CardBody>
            </Card>
          </div>
        </>
      );
    }
}