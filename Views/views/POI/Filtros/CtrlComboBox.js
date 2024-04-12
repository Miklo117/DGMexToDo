import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import { callKrakenApi } from '../../../utils/utils';

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
  }

  componentDidMount() { }

  render() {
    const customStyle = {
      height: '60px',
    };


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
                value={this.props.value}
                ref={this.props.reference}
                dataSource={this.props.data !== undefined ? this.props.data : this.state.datos}
                displayExpr={this.props.displayExpr}
                valueExpr={this.props.valueExpr}
                searchEnabled={true}
                searchMode="contains"
                searchExpr={this.props.searchExpr}
                placeholder={this.props.placeholder}
                showClearButton={true}
                searchTimeout={200}
                minSearchLength={0}
                showDataBeforeSearch={false}
                onValueChanged={this.props.onChange}
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default CtrlComboBox;
