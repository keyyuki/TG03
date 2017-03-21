import React, { Component } from 'react';
import {View, Dimensions, TouchableOpacity, ScrollView, Text, StyleSheet,Image } from 'react-native';
import {  Icon} from 'native-base';
import EventModel from '../../../../../model/EventModel';
import Theme from '../../../../../theme';

class OverviewCard extends Component{

    render(){
        var stars = this.props.stars;
        if(stars == undefined || !stars){
            stars = {
                1 : 0,
                2 : 0,
                3 : 0,
                4 : 0,
                5 : 0,
            }
        }
        
        
        return (
            <View style={styles.main}>
                <View style={styles.containerLeft}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                        </View>    
                        <View style={styles.listItemRight}>
                            <Text style={styles.text}>{stars['5']} lần</Text>
                        </View>    
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                        </View>    
                        <View style={styles.listItemRight}>
                            <Text style={styles.text}>{stars['4']} lần</Text>
                        </View>    
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                        </View>    
                        <View style={styles.listItemRight}>
                            <Text style={styles.text}>{stars['3']} lần</Text>
                        </View>    
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            
                            <Icon name="md-star" style={styles.star} /> 
                            <Icon name="md-star" style={styles.star} /> 
                            
                        </View>    
                        <View style={styles.listItemRight}>
                            <Text style={styles.text}>{stars['2']} lần</Text>
                        </View>    
                    </View>

                    <View style={styles.listItem}>
                        <View style={styles.listItemLeft}>
                            <Icon name="md-star" style={styles.star} /> 
                        </View>    
                        <View style={styles.listItemRight}>
                            <Text style={styles.text}>{stars['1']} lần</Text>
                        </View>    
                    </View>
                </View>

                <View style={styles.containerRight}>
                    <View style={styles.listItem}>
                        <View style={styles.listItemRight}>
                            <Text style={styles.text}>{this.props.totalDuration ? EventModel.getDisplayDuration(this.props.totalDuration, ' giờ', ' phút'): '0 phút'}</Text>
                        </View>    
                    </View>
                    <View style={styles.listItem}>
                        <View style={styles.listItemRight}>
                            <Text style={styles.text}>{this.props.totalEvent ? this.props.totalEvent : 0} sự kiện</Text>
                        </View>    
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        backgroundColor:"#fff",
        borderColor: Theme.borderColor,
        borderWidth: 1,
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingBottom: 20,
        marginBottom: 25
    }, 
    containerLeft: {
        flex:1.25,
        paddingTop: 10,
        
        
    },
    containerRight: {
        flex:1,
        paddingTop: 10,
        alignItems: "flex-end",
        paddingRight: 10,
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 3
    },
    listItemLeft: {
        width: 100,
        flexDirection: "row-reverse",
        alignItems: "flex-end",
        marginLeft: 10
    },
    listItemRight: {
        
    },
    star: {
        fontSize: 20,
        color: Theme.mainColor,
        
        marginLeft:4
    },
    text: {
        fontSize: 14, 
        color: "#000"
    }
})

module.exports = OverviewCard;