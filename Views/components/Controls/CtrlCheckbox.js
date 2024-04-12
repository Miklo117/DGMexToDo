import React from "react";
import { CheckBox } from 'devextreme-react/check-box';
import { Row, Col } from 'reactstrap';

function CtrlCheckbox(props) {
  const customStyle = {
    height: "60px"
  };


  return (

    <div className="row m-0 p-0 mb-1 align-items-center">
      <Col md={{ size: 12 }}>
        <Row style={customStyle}>
          <Col md={{ size: 12 }}>
            <CheckBox defaultValue={false} onValueChanged={props.onChange} value={props.value !== undefined ? props.value : null} />
            <span className="ml-2">{props.etiqueta}</span>
          </Col>
        </Row>
      </Col>
    </div>

  );
}

export default CtrlCheckbox;