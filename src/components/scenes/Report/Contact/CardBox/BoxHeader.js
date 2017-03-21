import React, { Component } from 'react';
import {StyleSheet, View, Text} from 'react-native';

class BoxHeader extends Component{
    render(){
        return (
            <View style={styles.outer}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    outer:{
        backgroundColor: '#ddd',
        alignItems: "center",
        height: 34,
        justifyContent:"space-around"
    },
    title: {
        fontSize:15,
        fontWeight:"bold"
    }
})
module.exports = BoxHeader;