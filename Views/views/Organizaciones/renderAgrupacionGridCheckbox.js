/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-indent */
import React from 'react';
import { CheckBox } from 'devextreme-react';

export default class renderAgrupacionGridCheckbox extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            currentValue: props.data.data.BajaLogica
        };
    }

    render() {
        return (
            <CheckBox 
              disabled={true} 
              defaultValue={this.props.data.data.BajaLogica === 1 ? true : false}
            />
        );
    }
}