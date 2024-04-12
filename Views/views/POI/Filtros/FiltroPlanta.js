import React from 'react';
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import CtrlComboBox from './CtrlComboBox';
import { config } from '../../../utils/config';
import { callApi, callKrakenApi, Translate } from '../../../utils/utils';

export default class FiltroPlanta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
  }

  render() {
    return (
      <>
        <Row style={{ marginleft: 0, marginright: 0 }}>
          <Col md={{ size: 12 }} style={{ padding: 0, margin: 0 }}>
            <CtrlComboBox
              etiqueta={Translate("Filtros.Planta")}
              valueExpr="Clave"
              displayExpr="Nombre"
              value={this.props.claUbicOrig}
              data={this.props.data}
              onChange={this.props.onChangeUbicOrig}
              placeholder={Translate("Planta.Facility")}
            />
          </Col>
        </Row>
        <Row style={{ marginleft: 0, marginright: 0 }}>
          <Col md={{ size: 12 }} style={{ padding: 0, margin: 0 }}>
            <CtrlComboBox
              etiqueta={Translate("Filtros.PlantaDestino")}
              valueExpr="Clave"
              displayExpr="Nombre"
              value={this.props.claUbicDest}
              data={this.props.data}
              onChange={this.props.onChangeUbicDest}
              placeholder={Translate("Planta.Destination")}
            />
          </Col>
        </Row>
      </>
    );
  }
}
