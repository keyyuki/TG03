import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

class BoxFooter extends Component{
    render(){
        return (
            <TouchableOpacity style={{
                alignItems:"center",
                justifyContent:"space-around",
                height: 35,
                borderBottomWidth:1,
                borderBottomColor:'#DDD',
            }}>
                <Text>{this.props.title != undefined ? this.props.title : 'Xem thêm...'}</Text>
            </TouchableOpacity>
        )
    }
}

module.exports = BoxFooter;

