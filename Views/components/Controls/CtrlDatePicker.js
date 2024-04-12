import React from "react";
import DateBox from 'devextreme-react/date-box';
import { Row, Col } from 'reactstrap';
import { callApi } from "../../utils/utils";
import { config } from "../../utils/config";


function CtrlDatePicker(props) {

  return (

    <div className="row m-0 p-0 mb-1 align-items-center">
      <Col md={{ size: 12 }}>
        <Row style={{ height: 24 }}>
          <Col md={{ size: 12 }}>
            <div className="pl-xl-2 subtitle-1">
              {props.etiqueta}
            </div>
          </Col>
        </Row>
        <Row style={{ height: 32 }}>
          <Col md={{ size: 12 }}>
            <DateBox defaultValue={props.defaultValue} type="date" onValueChanged={props.onChange} value={props.value} />
          </Col>
        </Row>
      </Col>
    </div>

  );

}

export default CtrlDatePicker;