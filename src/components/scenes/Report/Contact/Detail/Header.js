import React, { Component } from 'react';
import {View, Dimensions, TouchableOpacity, ScrollView, Text, StyleSheet,Image } from 'react-native';
import {  Icon} from 'native-base';
import Theme from '../../../../../theme';
import ContactModel from '../../../../../model/ContactModel'

const bgImage = require('../../../../../../img/bg.png')
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;




class Header extends Component{
    _renderInformation(){
        var contact = this.props.contact
        var emails = [];
        var mobiles = [];
        var facebooks = [];
        contact.information.forEach(item => {
            if(item.type == ContactModel.contactInforTypes.phoneNumber){
                mobiles.push(item.content)
            }
            if(item.type == ContactModel.contactInforTypes.email){
                emails.push(item.content)
            }
            
        })
        var result = [];
        if(mobiles.length){
            result.push(<Text key="mobiles" style={{fontSize: 12, color: "#fff"}}>điện thoại: {mobiles.join(', ')}</Text>)
        }
        if(emails.length){
            result.push(<Text key="emails" style={{fontSize: 12, color: "#fff"}}>email: {emails.join(', ')}</Text>)
        }
        if(facebooks.length){
            result.push(<Text key="facebooks" style={{fontSize: 12, color: "#fff"}}>facebook: {facebooks.join(', ')}</Text>)
        }
        return result
    }

    render(){
       
        var contact = this.props.contact
        var name =  ContactModel.getDisplayName(contact)
        
        return (
            <Image style={styles.main} resizeMode="cover" source={bgImage}>
                <View style={styles.leftContainer}>
                    <View style={styles.thumb}>
                        <Icon name="md-person" style={styles.iconAvatar} />
                    </View>
                    <TouchableOpacity style={styles.backButton} onPress={() => {this.props.onPressBackButton()}}>
                        <Icon name="md-arrow-back" style={{color: "#fff"}}/>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flex:2, paddingLeft:10,
                    paddingTop: 36,

                }}>
                    <Text style={{fontSize: 24, color: "#fff", marginBottom: 15}}>{name}</Text>
                    {this._renderInformation()}
                </View>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        height: 174,
        width: deviceWidth,
        flexDirection: "row",
        
    },
    leftContainer: {
        flex:1, 
        flexDirection: "row",
        paddingLeft: 18,
        paddingTop: 40,
        position: "relative"
    },
    thumb: {
         width: 92,
        height: 92,
        borderColor: Theme.borderColor,
        borderWidth: 1,
        borderRadius: 46,
        overflow: "hidden",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "space-around"
    },
    iconAvatar: {
        fontSize: 80, 
        color: Theme.mainColor
    },
    backButton: {
        position: "absolute",
        paddingHorizontal: 10,
        paddingVertical: 8,
        left: 8
    }
})
module.exports = Header