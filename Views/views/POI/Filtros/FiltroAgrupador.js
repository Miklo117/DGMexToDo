import React from 'react';
import { Row, Col } from 'reactstrap';
import { config } from '../../../utils/config';
import { callApi, callKrakenApi, Translate } from '../../../utils/utils';
import TagBox from 'devextreme-react/tag-box';
import {
  Validator,
  RequiredRule
} from 'devextreme-react/validator';

export default class FiltroPlanta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource:[]
    };

    this.GetSelectedAgrupador = this.GetSelectedAgrupador.bind(this);
  }

  GetSelectedAgrupador =(e) => {
    this.props.GetSelectedAgrupador(e);
  }
  
  getDataAgrupadores(){
    const urlApiService = `${config.UrlApiProject}POI/getagrupadores`;

      callApi(`${urlApiService}`, 'POST', {}, (result) => {
        this.setState({
          dataSource: result.data[0],
        });
      });
  }

  componentDidMount() {
    this.getDataAgrupadores();
  }

  render() {
    return (
      <>
        <Row style={{ height: 24 }}>
          <Col md={{ size: 12 }}>
            <div className="pl-xl-2 subtitle-1">{Translate("Filtros.Agrupador")}</div>
          </Col>
        </Row>
        <Row style={{ marginleft: 0, marginright: 0 }}>
          <Col md={{ size: 12 }} style={{ padding: 0, margin: 0 }}>
            {/* 
            <CtrlTreeViewComboBox 
              value={this.props.value}
              dataSource={this.state.dataSource} 
              Default={12}
              onTreeViewCallback={this.GetSelectedAgrupador} 
              selectionMode="multiple" 
              checkBoxesMode="normal"
              demand={false}
            > 
            </CtrlTreeViewComboBox>
            */}
            <TagBox
              value={this.props.value}
              dataSource={this.state.dataSource}
              displayExpr="name"
              showSelectionControls={true}
              valueExpr="ID"
              onValueChanged={this.GetSelectedAgrupador}
              placeholder={Translate("Agrupador.Placeholder")}
              searchEnabled={true}
            >
            </TagBox>
          </Col>
        </Row>
      </>
    );
  }
}
