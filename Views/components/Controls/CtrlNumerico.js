import React from "react";
import { NumberBox, Button as NumberBoxButton } from "devextreme-react/number-box";
import { Row, Col } from 'reactstrap';

class CtrlNumerico extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    const customStyle = {
      height: "40px",
      pointerEvents: "auto",
      background: "#fff"
    };


    return (

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
              <NumberBox
                showClearButton={true}
                showSpinButtons={true}
                value={this.props.value}
                onValueChanged={this.props.onChange}
              >
                <NumberBoxButton name="clear" />
                <NumberBoxButton name="spins" />
              </NumberBox>
            </Col>
          </Row>
        </Col>

      </Row>

    );

  }
}

export default CtrlNumerico;