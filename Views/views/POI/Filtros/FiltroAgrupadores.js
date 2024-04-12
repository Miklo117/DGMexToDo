import React from 'react';
import { Card, CardHeader, CardBody, Row, Col, CardTitle } from 'reactstrap';
import CtrlComboBox from './CtrlComboBox';
import { config } from '../../../utils/config';
import { callApi, callKrakenApi, Translate } from '../../../utils/utils';


export default class FiltroAgrupadores extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        const urlApiService = `${config.UrlApiProject}agrupador/agrupadores`;

        callApi(urlApiService, 'GET', {}, (result) => {
            this.setState({
                agrupacionDataSource: result.data
            });
        });
    }

    render() {
        return (
          <>
            <Row style={{ marginleft: 0, marginright: 0 }}>
              <Col md={{ size: 12 }} style={{ padding: 0, margin: 0 }}>
                <CtrlComboBox
                  etiqueta={Translate("Filtros.Agrupadores")}
                  valueExpr="claAgrupadorOrganizacion"
                  displayExpr="nomAgrupadorOrganizacion"
                  value={this.props.claUbicOrig}
                  data={this.state.agrupacionDataSource}
                  onChange={this.props.onChangeAgrupadores}
                  placeholder={Translate("Filtros.Todas")}
                />
              </Col>    
            </Row>            
          </>
        );
    }
}