import React, {Component, } from 'react';
import {View, Text, TouchableHighlight, Dimensions, Image, StyleSheet} from 'react-native';
import Slider from './Slider'



const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const defaultWidth = deviceWidth - 20;
const defaultHeight = Math.round(defaultWidth* 2/3);
const styles = StyleSheet.create({
    outer:{
        width: defaultWidth,
        height: defaultHeight,
        flexDirection: 'row',
        flexWrap:'wrap',
        justifyContent:'space-between',
        backgroundColor: "#ccc",
        alignSelf:"center",
        overflow:'hidden'
    },
    singleImageContainer: {
        width: defaultWidth,
        height: defaultHeight,
        backgroundColor: "#ccc"
    }

})

class ImageGrid extends Component{
    constructor(props){
        super(props);
        this.state = {
            openSlider: false
        }
    }
    
    _render_1(){
        
        return (
        <View style={[styles.outer, this.props.style]}>
            
            <TouchableHighlight  onPress={() => this._onClickImage()}  style={{justifyContent:'space-between', alignSelf:"center"}}>
                <Image style={styles.singleImageContainer} source={this.props.dataSource[0]} resizeMode="cover"/>
            </TouchableHighlight>
            <Slider 
                    dataSource={this.props.dataSource} 
                    isOpen={this.state.openSlider} 
                    onTap={()=>{this.setState({openSlider:false})}} />
        </View>);
    }

    _render_2(){
        var customstyle = this.props.style == undefined ? [] : this.props.style
        var width = customstyle.width == undefined ? defaultWidth:  customstyle.width;
        width -= 4;
        var height = customstyle.height == undefined ? defaultHeight : customstyle.height;
       
        return (
            <View style={[styles.outer, this.props.style]}>
                {
                    this.props.dataSource.map((item, i) => {
                        return (
                            <TouchableHighlight onPress={() => this._onClickImage()} key={'img_'+i} style={{width:Math.floor(width/2), marginBottom:4}}>
                                <Image key={'img_'+i} style={[styles.singleImageContainer, {width:Math.floor(width/2) }]} source={item} resizeMode="cover"/>
                            </TouchableHighlight>
                            )
                    }
                        
                    )
                }
                <Slider 
                    dataSource={this.props.dataSource} 
                    isOpen={this.state.openSlider} 
                    onTap={()=>{this.setState({openSlider:false})}} />
            </View>
        )
    }

    _render_3(){
        var customstyle = this.props.style == undefined ? [] : this.props.style
        var width = customstyle.width == undefined ? defaultWidth:  customstyle.width;
        
        var height = Math.round((7/6)*width);
        var mainImgHeight = Math.round(2/3*width - 2);
        var subImageHeight = Math.round(1/2*width - 2);

        return (
            <View style={[styles.outer, this.props.style, {height:height}]}>
                {
                    this.props.dataSource.map((item, i) => {
                        if(i==0){
                            return (
                                <TouchableHighlight onPress={() => this._onClickImage()} key={'img_'+i} style={{width:width, height: mainImgHeight, marginBottom:4}}>
                                    <Image key={'img_'+i} 
                                    style={[styles.singleImageContainer, {width:width, height: mainImgHeight, marginBottom:4 }]} 
                                    source={item} resizeMode="cover"/>
                                </TouchableHighlight>
                                )
                        }
                        return (
                            <TouchableHighlight onPress={() => this._onClickImage()} key={'img_'+i} style={{width:subImageHeight, height: subImageHeight, marginBottom:4}}>
                                <Image key={'img_'+i} 
                                style={[styles.singleImageContainer, {width:subImageHeight, height:subImageHeight }]} 
                                source={item} resizeMode="cover"/>
                            </TouchableHighlight>
                            )
                    }
                        
                    )
                }
                <Slider 
                    dataSource={this.props.dataSource} 
                    isOpen={this.state.openSlider} 
                    onTap={()=>{this.setState({openSlider:false})}} />
            </View>
        )
    }
    _render_4(){
        var customstyle = this.props.style == undefined ? [] : this.props.style
        var width = customstyle.width == undefined ? defaultWidth:  customstyle.width;
        
        var height = width;
        var mainImgHeight = Math.round(2/3*width - 2);
        var subImageHeight = Math.round(1/3*width - 2);
        return (
            <View style={[styles.outer, this.props.style, {height:height, position:"relative"}]}>
                {
                    this.props.dataSource.map((item, i) => {
                        if(i==0){
                            return (
                            <TouchableHighlight onPress={() => this._onClickImage()} key={'img_'+i} style={{width:width, height: mainImgHeight, marginBottom:4}}>
                                <Image 
                                    style={[styles.singleImageContainer, {width:width, height: mainImgHeight, marginBottom:4 }]} 
                                    source={item} resizeMode="cover"/>
                            </TouchableHighlight>
                            )
                        }
                        return <TouchableHighlight onPress={() => this._onClickImage()} key={'img_'+i} style={{width:subImageHeight, height:subImageHeight}}><Image 
                            style={[styles.singleImageContainer, {width:subImageHeight, height:subImageHeight }]} 
                            source={item} resizeMode="cover"/></TouchableHighlight>
                    }
                        
                    )
                }
                {this._render_overlay(subImageHeight)}
                <Slider 
                    dataSource={this.props.dataSource} 
                    isOpen={this.state.openSlider} 
                    onTap={()=>{this.setState({openSlider:false})}} />
            </View>
        )
    }
    _render_overlay(width){
        if(this.props.dataSource.length <= 4){
            return null;
        }
        var numb = this.props.dataSource.length - 4
        return (
            <TouchableHighlight onPress={() => this._onClickImage()}  style={{position:"absolute", right:0, bottom:0, width:width, height:width}}>
                <View>
                    <View style={{ width: width, height: width, backgroundColor:'#ccc', opacity:0.6, alignItems:"center", justifyContent:"center"}}>
                        <Text style={{fontSize: width/2, color:"black", fontWeight:"bold", opacity:1,}}>{'+' + numb}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }


    _onClickImage(){
        console.log('=========pres========')
        this.setState({openSlider: true})
    }
    render(){
        if(!this.props.dataSource.length){
            return null;
        }
        if(this.props.dataSource.length == 1){
            return this._render_1();
        }
         if(this.props.dataSource.length == 2){
            return this._render_2();
        }
        if(this.props.dataSource.length == 3){
            return this._render_3();
        }
        return this._render_4()
    }

}

export default ImageGrid