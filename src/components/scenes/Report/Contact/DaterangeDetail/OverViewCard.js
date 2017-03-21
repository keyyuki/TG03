import React, { Component } from 'react';
import {View, Dimensions, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import EventModel from '../../../../../model/EventModel';
import ContactModel from '../../../../../model/ContactModel'

class OverViewCard extends Component{
    static defaultProps = {
        startDate: '',
        endDate: '',
        totalCount: 0,
        totalDuration: 0,
        mostCountContact: null,
        mostLongContact: null,
        mostEffectiveContact: null
    }
    render(){
        var mostCountContactName = '';
        var mostLongContactName = '';
        var mostEffectiveContactName = '';

        if(this.props.mostCountContact){
            mostCountContactName = ContactModel.getDisplayName(this.props.mostCountContact)
        }
        if(this.props.mostLongContact){
            mostLongContactName = ContactModel.getDisplayName(this.props.mostLongContact)
        }
        if(this.props.mostEffectiveContact){
            mostEffectiveContactName = ContactModel.getDisplayName(this.props.mostEffectiveContact)
        }
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tổng quan</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.ListItem}>
                        <View style={styles.ListItemLeft}>
                            <Text style={styles.ListItemLeftText}>Thống kê từ:</Text>
                        </View>
                        <View style={styles.ListItemRight}>
                            <Text style={styles.ListItemRightText}>{this.props.startDate + ' - ' + this.props.endDate}</Text>
                        </View>
                    </View>
                    <View style={styles.ListItem}>
                        <View style={styles.ListItemLeft}>
                            <Text style={styles.ListItemLeftText}>Số người đã gặp:</Text>
                        </View>
                        <View style={styles.ListItemRight}>
                            <Text style={styles.ListItemRightText}>{this.props.totalCount}</Text>
                        </View>
                    </View>
                    <View style={styles.ListItem}>
                        <View style={styles.ListItemLeft}>
                            <Text style={styles.ListItemLeftText}>Thời gian giao tiếp:</Text>
                        </View>
                        <View style={styles.ListItemRight}>
                            <Text style={styles.ListItemRightText}>{EventModel.getDisplayDuration(this.props.totalDuration, ' giờ', ' phút')}</Text>
                        </View>
                    </View>
                    <View style={styles.ListItem}>
                        <View style={styles.ListItemLeft}>
                            <Text style={styles.ListItemLeftText}>Người gặp nhiều nhất:</Text>
                        </View>
                        <View style={styles.ListItemRight}>
                            <Text style={styles.ListItemRightText}>
                                {mostCountContactName}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.ListItem}>
                        <View style={styles.ListItemLeft}>
                            <Text style={styles.ListItemLeftText}>Người gặp lâu nhất:</Text>
                        </View>
                        <View style={styles.ListItemRight}>
                            <Text style={styles.ListItemRightText}>
                                {mostLongContactName}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.ListItem}>
                        <View style={styles.ListItemLeft}>
                            <Text style={styles.ListItemLeftText}>Người hiệu quả nhất:</Text>
                        </View>
                        <View style={styles.ListItemRight}>
                            <Text style={styles.ListItemRightText}>
                                {mostEffectiveContactName}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    main: {
        paddingHorizontal: 5, 
        backgroundColor:"#fff",
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    header: {
        paddingHorizontal: 15, 
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    title:{
        fontSize: 20, 
        fontWeight: "bold", 
        color: "#000"
    },
    content: {
        paddingHorizontal: 15, 
        paddingVertical: 8,
    },
    ListItem:{
        flexDirection: "row", 
        justifyContent:"space-between", 
        paddingBottom: 12
    },
    ListItemLeft:{
        flex:-1, 
        alignItems: "flex-start", 
        paddingRight:10
    },
    ListItemLeftText:{
        fontSize:14, 
        color:"#000", 
        
    },
    ListItemRight:{
        flex:-1, 
        alignItems: "flex-end", 
        paddingLeft: 10
    },
    ListItemRightText: {
        fontSize:14, 
        color:"#898989"
    }
    
});

module.exports = OverViewCard;