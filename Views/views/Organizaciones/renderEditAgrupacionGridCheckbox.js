/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-indent */
import React from 'react';
import { CheckBox } from 'devextreme-react';

export default class renderEditAgrupacionGridCheckbox extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            currentValue: props.data.data.BajaLogica
        };
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(e){
        this.setState({
            currentValue: e.value === true ? 1 : 0
        })
        this.props.data.setValue(this.state.currentValue, "BajaLogica");
    }

    render() {
        return (
            <CheckBox 
              disabled={false} 
              defaultValue={this.props.data.data.BajaLogica === 1 ? true : false}
              onValueChanged={this.onValueChanged}
            />
        );
    }
}