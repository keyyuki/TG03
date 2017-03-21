import React, {Component, } from 'react';
import {View, Text, TouchableHighlight, TouchableWithoutFeedback, Dimensions, Image, StyleSheet, Modal, ScrollView} from 'react-native';
import { Button, Icon } from 'native-base';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class Slider extends Component{
    constructor(props){
        super(props);
        
    }

    render(){
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.props.isOpen}
                onRequestClose={() => {}}
            
            >

            <ScrollView horizontal={true} pagingEnabled={true}>
                {
                    this.props.dataSource.map((src, i) => {
                        return this.renderPage(src, i)
                    })
                }
            </ScrollView>
            <Button onPress={() => this.onTap()} transparent style={{position:"absolute", top:0, left:0}}>
                <Icon name="md-arrow-back" style={{color:"white"}}/>
            </Button>
            </Modal>
        )
    }

    renderPage(src, i){
        var show = true;
        Image.getSize(src.uri, () => {}, (e) => {console.log('image error', e); show=false})
        if(!show){
            return null;
        }
        return (
            <View key={"key_"+i} style={{width:deviceWidth, height:deviceHeight, backgroundColor:"#000"}}>
                
                <Image style={{width:deviceWidth, height:deviceHeight}} 
                source={src} resizeMode="contain"/>
                
            </View>
        )
    }

    onTap(){
        this.props.onTap()
    }
}