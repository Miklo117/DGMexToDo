import React from 'react';
import { Autocomplete } from 'devextreme-react/autocomplete';
import { Row, Col } from 'reactstrap';
import { callKrakenApi } from '../../utils/utils';

function CtrlAutoComplete(props) {

  const dataSource = {
    key: 'ClaCliente',
    keyType: 'Int32',
    perf1: '',
    claUsuario: 0,
    load: async (loadOptions) => {
      let data = [];

      if (loadOptions.searchValue === null)
        return;

      const params = {
        Valor: loadOptions.searchValue,
        Tipo: 3,
        IncluirTodosSN: 0,
      };

      await callKrakenApi(23, 17, params, 1, (res) => {
        data = res.Result0;
      });

      return data;
    },
  };



  return (
    <Row style={{ padding: 0, margin: 0, marginBottom: 1, alignItems: 'center' }} className="mb-1">
      <Col md={{ size: 12 }} style={{ padding: 0, margin: 0 }}>
        <Row style={{ height: '24px' }}>
          <Col md={{ size: 12 }}>
            <div className="pl-xl-2 subtitle-1">{props.etiqueta}</div>
          </Col>
        </Row>
        <Row style={{ height: '32px' }}>
          <Col md={{ size: 12 }}>
            <Autocomplete
              ref={props.reference}
              dataSource={dataSource}
              placeholder={props.placeholder}
              valueExpr={props.valueExpr}
              displayExpr={props.displayExpr}
              showClearButton={true}
              minSearchLength={3}
              searchTimeout={500}
              onSelectionChanged={props.onChange}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default CtrlAutoComplete;
