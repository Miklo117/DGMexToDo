import React from "react";
import { TextBox } from "devextreme-react/text-box";
import { Row, Col } from 'reactstrap';

class CtrlTextBox extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      };
    }

    render(){
        return(
          <Row className="mb-1">
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
                  <TextBox
                    value={this.props.value}
                    onValueChanged={this.props.onChange}
                  >
                  </TextBox>
                </Col>
              </Row>
            </Col>
          </Row>
        );
    }
}

export default CtrlTextBox;