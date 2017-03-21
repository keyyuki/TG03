import React, { Component } from 'react';
import {Text} from 'react-native';

export default class Text12 extends Component{
    render(){
        return (
            <Text style={{fontSize:12, color:"black"}} >
                <Text {...this.props}/>
            </Text>
        )
    }
} 