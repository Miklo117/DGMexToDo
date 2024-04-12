/* eslint-disable no-lonely-if */
/* eslint-disable block-scoped-var */
/* eslint-disable no-redeclare */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import React from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import { config } from '../../utils/config';
import { callApi, setSessionData, getSessionItem, languageInit, Translate, callKrakenApi } from '../../utils/utils';


class CtrlArticulosTreView extends React.Component{
    constructor(props) {
        super(props);

        this.state ={
            dataSource: [],
            treeBoxValue: "1",
            dropDwonText: ""
        };

        this.treeView = null;

        this.treeView_itemSelectionChanged = this.treeView_itemSelectionChanged.bind(this);
        this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this);
        this.treeViewRender = this.treeViewRender.bind(this);
    }

    getArticulos(){
        var objData = null;
        const urlApiService = `${config.UrlApiProject}articulo/krakenarticulos`;
        
        callApi(`${urlApiService}`, 'GET', {}, (result) => {
            const serializedData = result.data.replace(/id/g, "ID");
            objData = JSON.parse(serializedData);
        });
        return objData;
    }

    treeViewRender(){
        return(
          <TreeView
            ref={(ref) => this.treeView = ref}
            dataStructure="plain"
            selectionMode="single" 
            checkBoxesMode="none"
            selectNodesRecursive={false}
            selectByClick={true}
            keyExpr="ID"
            parentIdExpr="categoryId"
            displayExpr="name"
            onItemSelectionChanged={this.treeView_itemSelectionChanged}
            width="auto"
            rootValue=""
            createChildren={this.createChildren}
            searchEnabled={true}
            searchMode="contains"
          />
        );
    }

    treeView_itemSelectionChanged(e) {
        if(e.component.getSelectedNodes().length !== 0){
            if(e.component.getSelectedNodes()[0].key.toString().split('_').length !== 2){
                this.setState({
                    dropDwonText: e.component.getSelectedNodes()[0].text
                });
                
                this.props.onTreeViewCallback(e.component.getSelectedNodes());

                this.treeView.instance.unselectAll();
            }
        }
    }

    syncTreeViewSelection(e) {
        this.setState({
            treeBoxValue: e.value
        });
        if (!this.treeView) return;
    
        if (!e.value) {
            this.treeView.instance.unselectAll();
        } 
        else {
            this.treeView.instance.selectItem(e.value);
        }
    }

    async createChildren(parent){
        const articuloId = parent ? parent.itemData.ID ? parent.itemData.ID : parent.itemData.id : 0;
        const categoryId = parent ? parent.itemData.categoryId : 0;

        var newdata = null;
        
        if(categoryId === 0)
        {
            const urlApiService = `${config.UrlApiProject}articulo/krakenarticulos`;
        
            var asyncC = await callApi(`${urlApiService}`, 'GET', {}, (result) => {
                const serializedData = result.data.replace(/id/g, "ID");
                newdata = JSON.parse(serializedData);
            });
        }
        else{
            if(articuloId.split('_').length >= 3)
            {
                const claArticulo = articuloId.split('_')[2];
                const urlApiService = `${config.UrlApiProject}articulo/subarticulos?articuloId=${articuloId}`;

                var asyncC = await callApi(`${urlApiService}`, 'GET', {}, (result) => {
                    newdata = result.data;
                });   
            }
        }         

        return newdata;
    }
    
    clear(){
        this.setState({
          dropDwonText: null,
          treeBoxValue: null,
        });
    }

    render() {
        return(
          <div>
            <DropDownBox
              value={this.state.dropDwonText}       
              valueExpr="id"
              displayExpr="text"     
              placeholder={Translate("Articulos.TreeSelectArticulos.Selecciona un valor")}
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

export default CtrlArticulosTreView;