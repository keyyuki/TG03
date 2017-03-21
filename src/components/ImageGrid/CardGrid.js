import React, {Component} from 'react';
import { connect } from 'react-redux';
import {View, TextInput, TouchableWithoutFeedback, Image} from 'react-native';
import {ListItem, CheckBox, Input, Button, Icon, Text} from 'native-base';

class CardGrid extends Component{

    _renderSingle(){
        return (
            <TouchableWithoutFeedback>
            <Image style={{
                width: this.props.width -2, 
                height: this.props.height-2,
                borderWidth: 1
            }} source={this.props.dataSources[0]} />
            </TouchableWithoutFeedback>
        )
    }

    _renderTwo(){
        var imageWidth = Math.round((this.props.width - 2)/2) - 2
        return (
            <View style={{
                width: this.props.width, 
                height: this.props.height,
                flexDirection:"row"
            }}>
                <View> style={{flex:1, paddingRight:1}}
                <TouchableWithoutFeedback>
                    <Image style={{
                        width: imageWidth, 
                        height: this.props.height-2,
                        borderWidth: 1
                    }} source={this.props.dataSources[0]} />
                </TouchableWithoutFeedback>
                </View>

                <View style={{flex:1, paddingRight:1, position:"relative"}}>
                <TouchableWithoutFeedback>
                    <Image style={{
                        width: imageWidth, 
                        height: this.props.height-2,
                        borderWidth: 1
                    }} source={this.props.dataSources[1]} />
                    {this._renderOverlay()}
                </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    _renderOverlay(){
        if(this.props.dataSources.length <= 2){
            return null;
        }
        var imageWidth = Math.round((this.props.width - 2)/2) - 2
        return (
            <View style={{
                width: imageWidth, 
                height: this.props.height-2,
                position: 'absolute',
                top:0,
                left:0,
                alignItems: 'center',
                justifyContent:"space-around",
                backgroundColor: "gray",
                opacity: 0.2
            }}>
                <Text style={{fontSize:30}}>{'+' + (this.props.dataSources.length -2).toString()}</Text>
            </View>
        )
    }

    render(){
        if(this.props.dataSources.length == 1){
            return this._renderSingle()
        } 
        if(this.props.dataSources.length > 1){
            return this._renderTwo()
        }
        return null;
    }
}
CardGrid.propTypes = {
    //dataSources: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
}
export default CardGrid;