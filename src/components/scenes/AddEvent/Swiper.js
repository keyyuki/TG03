import React, { Component } from 'react';
import { Image, View, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Container, Icon, DeckSwiper, Card, CardItem, Left, Body, Thumbnail, Text, Button } from 'native-base';
import {eventDeleteImage} from '../../../actions';
import ImageGrid from '../../ImageGrid';


class Swiper extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
            forceRender: false,
            forComponentUpdate: false
        }


    }

    
    
    render(){
        

        if(!this.state.forceRender &&  this.props.images && this.props.images.length){
            return (
                <ImageGrid dataSource={this.props.images} /> 
                
            )
        } else {
            return null
        }
        
    }

}
const mapStateToProps = (state) => {
    return {
        images: state.event.images
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        removeImage: (uri) => {
            dispatch(eventDeleteImage(uri))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Swiper)