import React from 'react';
import { Row, Col } from 'reactstrap';
import CtrlDatePicker from './CtrlDatePicker';
import { Translate } from '../../../utils/utils';

export default class FiltroFechas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataTipoFecha: [{ Clave: 1, Nombre: "Fecha Pedido" }, { Clave: 2, Nombre: "Fecha Embarque" }, { Clave: 3, Nombre: "Fecha Entrega" }],
    };
  }


  componentDidMount() {
  }

  render() {

    return (
      <>
        <Row>
          <Col md={{ size: 6 }} style={{ padding: 0, margin: 0 }}>
            <Row>
              <Col>
                <CtrlDatePicker
                  etiqueta={Translate("Filtros.FechaInicio")}
                  defaultValue={this.now}
                  onChange={this.props.onChangeFechaInicio}
                  disabledDates={this.disableDates} 
                  value={this.props.fechaInicio}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CtrlDatePicker
                  etiqueta={Translate("Filtros.FechaFin")}
                  defaultValue={this.now}
                  onChange={this.props.onChangeFechaFin}
                  disabledDates={this.disableDates} 
                  value={this.props.fechaFin}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

