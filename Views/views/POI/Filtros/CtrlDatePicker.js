import React from "react";
import DateBox from 'devextreme-react/date-box';
import { Row, Col } from 'reactstrap';
import { callApi } from "../../../utils/utils";
import { config } from "../../../utils/config";


export default class CtrlDatePicker extends React.Component {
  disableDates(args) {

    return args.date > new Date();
  }

  render(){
    return (
      <div className="row m-0 p-0 mb-1 align-items-center">
        <Col md={{ size: 12 }}>
          <Row style={{ height: 24 }}>
            <Col md={{ size: 12 }}>
              <div className="pl-xl-2 subtitle-1">
                {this.props.etiqueta}
              </div>
            </Col>
          </Row>
          <Row style={{ height: 32 }}>
            <Col md={{ size: 12 }}>
              <DateBox defaultValue={this.props.defaultValue} type="date" onValueChanged={this.props.onChange} value={this.props.value} pickerType="rollers" displayFormat="MM-yyyy" onChange={this.props.onChangeFechaFin} disabledDates={this.disableDates} />
            </Col>
          </Row>
        </Col>
      </div>

    );
  }
}
