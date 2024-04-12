import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import { callKrakenApi } from '../../utils/utils';

class CtrlComboBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datos: [],
    };
  }

  getData() {
    // reactContext 3: se extrae el action setClienteInfo del contexto, este guardara la informacion del cliente
    const params = {
      Valor: '',
      Tipo: 1,
      IncluirTodosSN: 0,
    };

    callKrakenApi(13, 5, params, 1, (res) => {
      this.setState({ datos: this.parseData(res.Result0) });
    });
  }

  parseData(data) {
    const lista = data.map((item) => (
      <option key={item.Clave} value={item.Clave}>
        {item.Nombre}
      </option>
    ));

    return lista;
  }

  componentDidMount() { }

  render() {
    const customStyle = {
      height: '60px',
    };

    const searchExpr = this.props.searchExpr !== undefined ? this.props.searchExpr : "Nombre";
    const displayExpr = this.props.displayExpr !== undefined ? this.props.displayExpr : "Nombre";
    const valueExpr = this.props.valueExpr !== undefined ? this.props.valueExpr : "Clave";

    return (
      <div className="row m-0 p-0 mb-1 align-items-center">
        <Col md={{ size: 12 }}>
          <Row style={{ height: 24 }}>
            <Col md={{ size: 12 }}>
              <div className="pl-xl-2 subtitle-1">{this.props.etiqueta}</div>
            </Col>
          </Row>
          <Row style={{ height: 32 }}>
            <Col md={{ size: 12 }}>
              <SelectBox
                ref={this.props.reference}
                dataSource={this.props.data !== undefined ? this.props.data : this.state.datos}
                displayExpr={displayExpr}
                valueExpr={valueExpr}
                searchEnabled={true}
                searchMode="contains"
                searchExpr={searchExpr}
                placeholder="Seleccionar"
                showClearButton={true}
                searchTimeout={200}
                minSearchLength={0}
                showDataBeforeSearch={false}
                onValueChanged={this.props.onChange}
                value={this.props.value !== undefined && this.props.value !== -1 ? this.props.value : undefined}
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default CtrlComboBox;
