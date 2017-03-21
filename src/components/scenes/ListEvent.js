import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Text} from 'react-native';

class ListEvent extends Component{
    render(){
        return (
            <View><Text>Hello, list event!</Text></View>
        )
    }
}

export default connect()(ListEvent)
