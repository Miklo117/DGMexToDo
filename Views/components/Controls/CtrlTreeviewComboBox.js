/* eslint-disable no-else-return */
import React from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import { Translate } from 'utils/utils';

class CtrlTreeViewComboBox extends React.Component{
    constructor(props) {
        super(props);

      this.treeView = null;
      if(this.props.default !== null && this.props.default !== undefined)
        this.state = {
            treeBoxValue: [this.props.default],
            dropDownBoxWidth: this.props.width,
            dropDwonText : this.props.dropDwonText
        };
      else{
        this.state = {
            treeBoxValue: [],
            dropDownBoxWidth: this.props.width,
            dropDwonText : this.props.dropDwonText
        };
      }

        this.treeView_itemSelectionChanged = this.treeView_itemSelectionChanged.bind(this);
        this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this);

        this.treeViewRender = this.treeViewRender.bind(this);
    }

    clear(){
      this.setState({
        dropDwonText: null,
        treeBoxValue: null,
      });
    }

    render() {
      if(this.props.demand === true)
      {
        return(
          <div>
            <DropDownBox
              value={this.state.dropDwonText}       
              valueExpr="text"
              displayExpr="text"     
              placeholder={Translate("Organizaciones.TreeSelectOrganizacion.Selecciona un valor")}
              showClearButton={true}
              dataSource={this.props.dataSource}
              onValueChanged={this.syncTreeViewSelection}
              contentRender={this.treeViewRender}
              width="auto"
            />
          </div>
        );
      }
      else{
        return(
          <div>
            <DropDownBox
              value={this.state.treeBoxValue}       
              valueExpr="ID"
              displayExpr="name"     
              placeholde={Translate("Articulos.TreeSelectArticulos.Selecciona un valor")}
              showClearButton={true}
              dataSource={this.props.dataSource}
              onValueChanged={this.syncTreeViewSelection}
              contentRender={this.treeViewRender}
              width="auto"
            />
          </div>
        );
      }
      
    }
    
    treeViewRender(){
      if(this.props.demand === true)
      {
        return(
          <TreeView
            ref={(ref) => this.treeView = ref}
            dataStructure="plain"
            selectionMode={this.props.selectionMode}
            showCheckBoxesMode={this.props.checkBoxesMode}
            displayExpr="text"
            selectNodesRecursive={false}
            selectByClick={true}
            onItemSelectionChanged={this.treeView_itemSelectionChanged}
            width="auto"
            createChildren={this.props.createChildren}
            rootValue=""
          />
        );
      }
      else{
        return(
          <TreeView
            dataSource={this.props.dataSource}
            ref={(ref) => this.treeView = ref}
            dataStructure="plain"
            keyExpr="ID"
            parentIdExpr="categoryId"
            selectionMode={this.props.selectionMode}
            showCheckBoxesMode={this.props.checkBoxesMode}
            displayExpr="name"
            selectNodesRecursive={false}
            selectByClick={true}
            onItemSelectionChanged={this.treeView_itemSelectionChanged}
            width="auto"
          />
        );
      }  
    }

    syncTreeViewSelection(e) {
        const treeView = (e.component.selectItem && e.component) || (this.treeView && this.treeView.instance);

        if (treeView) {
            if (e.value === null) {
            treeView.unselectAll();
            } else {
              const values = e.value || this.state.treeBoxValue;
              try{
                values && values.forEach((value) => {
                  treeView.selectItem(value);
                });
              }
              catch(error){
                  this.setState({
                    treeBoxValue: null
                  });
                console.log(error);
                return;
              }
            }
        }

        if (e.value !== undefined) {
          if(e.value != null){
            this.setState({
            treeBoxValue: e.value
            });
          }
        }
    }

    treeView_itemSelectionChanged(e) {
      if(this.props.demand === true)
      {
        if(e.component.getSelectedNodes().length !== 0)
        {
          this.setState({
            dropDwonText: e.component.getSelectedNodes()[0].text,
            treeBoxValue: e.component.getSelectedNodeKeys()
          });        
        }
      }
      else{
        this.setState({
          treeBoxValue: e.component.getSelectedNodeKeys()
        });
      }

      if(e.component.getSelectedNodes().length !== 0)
      {
        if(this.props.blockedLevels !== null && this.props.blockedLevels !== undefined){
          for(let i = 0; i < this.props.blockedLevels.length; i++){
            const level = this.props.blockedLevels[i];
            if(e.component.getSelectedNodes()[0].key.toString().split('_').length !== level){
              this.props.onTreeViewCallback(e.component.getSelectedNodes());
            }
            else if(this.props.selectionMode === "multiple"){
              this.props.onTreeViewCallback(e.component.getSelectedNodes());
            }
          }
        }
        else{
          this.props.onTreeViewCallback(e.component.getSelectedNodes());
        }
      }
      else if(e.component.getSelectedNodes() === 1){
        this.props.onTreeViewCallback(e.component.getSelectedNodes());
        this.setState({
          dropDownBoxWidth: "300px"
        })
      }
    }
}

export default CtrlTreeViewComboBox;