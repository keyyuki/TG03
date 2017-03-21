import React, { Component } from 'react';

import {View, Dimensions, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import {changeNavigation} from '../../../../../actions';
import {reportcontactChangeContactId} from '../../../../../actions/ReportActions';
import Theme from '../../../../../theme'





class ContactCard extends Component{
    render(){
        var name = '';
        var count = this.props.totalCount ? this.props.totalCount : 0;
        var duration = this.props.totalDuration ? this.props.totalDuration : 0;
        var effective = this.props.totalEffective ? this.props.totalEffective : 0;

        if(this.props.contactId){
            var contact = ContactModel.getContact(this.props.contactId)
            name = ContactModel.getDisplayName(contact)
        }
        

        return (
            <View style={styles.main}>
                <TouchableOpacity style={styles.header} onPress={() => {this.props.onPressViewDetail(this.props.contactId)}}>
                    <View style={styles.thumb}>
                    </View>
                    <Text style={styles.title}>{name}</Text>
                </TouchableOpacity>
                <View style={styles.content}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Text style={{fontSize:14, color:"#000"}}>Số lần gặp</Text>
                        </View>
                        <View style={styles.listItemRight}>
                            <Text style={{fontSize:14, color: "#898989"}}>{count}</Text>
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Text style={{fontSize:14, color:"#000"}}>Thời gian làm việc</Text>
                        </View>
                        <View style={styles.listItemRight}>
                            <Text style={{fontSize:14, color: "#898989"}}>{EventModel.getDisplayDuration(duration, ' giờ', ' phút')}</Text>
                        </View>
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Text style={{fontSize:14, color:"#000"}}>Điểm hiệu quả</Text>
                        </View>
                        <View style={styles.listItemRight}>
                            <Text style={{fontSize:14, color: "#898989"}}>{effective}</Text>
                        </View>
                    </View>

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        marginBottom: 25,
        borderWidth:1,
        borderColor: Theme.borderColor,
        paddingHorizontal: 5,
        backgroundColor: "#fff"
    },
    header: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: "row",
        
        alignItems:"flex-start",
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: 1
    },
    thumb: {
        width: 34,
        height: 34,
        borderColor: Theme.borderColor,
        borderWidth: 1,
        borderRadius: 17,
        backgroundColor: Theme.mainColor, 
        marginRight: 20, 
        overflow: "hidden"
    },
    avatar: {
        width: 34,
        height: 34,
    },
    title: {
        fontSize: 18, 
        color: "#000", 
        lineHeight: 30
    },
    content: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between", 
        paddingVertical: 3
    },
    listItemLeft: {
        flex:1,
        alignItems: "flex-start"
    },
    listItemRight: {
        flex:1,
        alignItems: "flex-end"
    }
})


module.exports = ContactCard;