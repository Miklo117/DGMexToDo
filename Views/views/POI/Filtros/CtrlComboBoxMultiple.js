import React from 'react'
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import { Row, Col } from 'reactstrap';
import { callKrakenApi } from '../../../utils/utils';




class CtrlComboBoxMultiple extends React.Component {
  constructor(props) {
    super(props);
    // this.options = 
    // [
    //   { value: 'Ubicacion', label: 'Ubicación' },
    //   { value: 'UbicaciónDestino', label: 'Ubicación Destino' },
    //   { value: 'Direccion', label: 'Dirección' },
    //   { value: 'SubDireccion', label: 'SubDirección' },
    //   { value: 'GteRegional', label: 'Gte. Regional' },
    //   { value: 'Gerente', label: 'Gerente' },
    // ];
    

    this.treeView = null;
    this.treeDataSource = props.options;
    this.treeView_itemSelectionChanged = this.treeView_itemSelectionChanged.bind(this);
    this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this);
    this.treeViewRender = this.treeViewRender.bind(this);
    this.state = {
      datos: [],
    };
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
              <DropDownBox
                value={this.state.treeBoxValue}
                valueExpr="value"
                displayExpr="label"
                placeholder="Seleccionar"
                showClearButton={true}
                dataSource={this.treeDataSource}
                onValueChanged={this.syncTreeViewSelection}
                contentRender={this.treeViewRender}
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }

  treeViewRender() {

    return (
      <TreeView 
        dataSource={this.treeDataSource}
        ref={(ref) => this.treeView = ref}
        dataStructure="plain"
        keyExpr="value"
        selectionMode="multiple"
        showCheckBoxesMode="normal"
        selectNodesRecursive={false}
        parentIdExpr="parentId"
        displayExpr="label"
        selectByClick={true}
        onContentReady={this.syncTreeViewSelection}
        onItemSelectionChanged={this.treeView_itemSelectionChanged}
      />
    );
  }

  syncTreeViewSelection(e) {
    const treeView = (e.component.selectItem && e.component) || (this.treeView && this.treeView.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } 
      else {
        const values = e.value || this.state.treeBoxValue;
        values && values.forEach((value) => {
          treeView.selectItem(value);
        });
      }
    }

    if (e.value !== undefined) {
      this.setState({
        treeBoxValue: e.value
      });
    }
  }

  treeView_itemSelectionChanged(e) {
    this.setState({
      treeBoxValue: e.component.getSelectedNodeKeys()
    });
  }
}

export default CtrlComboBoxMultiple;


