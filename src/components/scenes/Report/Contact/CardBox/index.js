import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Dimensions, Text, TouchableOpacity} from 'react-native';
import BoxHeader from './BoxHeader';
import BoxContent from './BoxContent';
import BoxFooter from './BoxFooter';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;



class CardBox extends Component{
    static propTypes = {
        dataSource: React.PropTypes.array.isRequired,
        onClickFooter: React.PropTypes.func,
        title: React.PropTypes.string.isRequired,

    }
    constructor(props) {
        super(props);

    }

    render(){
        
        return (
            <View style={[{width:deviceWidth, marginBottom:35, backgroundColor:"#fff"}, this.props.style]}>
                <BoxHeader title={this.props.title} />
                <BoxContent dataSource={this.props.dataSource} />
                <BoxFooter />
            </View>
        )
        
    }
}

module.exports = CardBox;