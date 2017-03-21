import React, { Component } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

class ListItem extends Component{
    render(){
        return (
            <TouchableOpacity style={styles.ListItemOuter}>
                <View style={styles.ListItemLeft}>
                    <Text style={{fontSize:15}}>{this.props.data.leftText}</Text>
                </View>
                <View style={styles.ListItemRight}>
                    <Text style={{fontSize:15}}>{this.props.data.rightText}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

class BoxContent extends Component{

    render(){
        if(!this.props.dataSource || !this.props.dataSource.length){
            return (
            <View style={{
                flexDirection:"column"
            }}>
                <TouchableOpacity style={styles.ListItemOuter}>
                    <View style={styles.ListItemLeft}>
                        <Text style={{fontSize:15, color:'#f0ad4e'}}>{'Không có dữ liệu'}</Text>
                    </View>
                    
                </TouchableOpacity>
            </View>
            );
        }
        
        return (

            <View style={{
                flexDirection:"column"
            }}>
            {
                this.props.dataSource.map((item, i) => {
                    return (<ListItem key={'List_item'+i} data={item}/>)
                })
            }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    ListItemOuter:{
        height: 45,
        borderBottomWidth:1,
        borderBottomColor:'#DDD',
        flexDirection: "row"
    },
    ListItemLeft:{
        flex: 5,
        alignItems: "flex-start",
        paddingLeft: 26,
        justifyContent:"space-around"
    },
    ListItemRight: {
        flex: 1,
        alignItems: "flex-start",
        paddingLeft: 5,
        justifyContent:"space-around",
    },
    
})
module.exports = BoxContent;