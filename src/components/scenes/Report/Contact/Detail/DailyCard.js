import React, { Component } from 'react';
import {View, Dimensions, TouchableOpacity, ScrollView, Text, StyleSheet,Image } from 'react-native';
import Moment from 'moment'
import {  Icon} from 'native-base';
import Theme from '../../../../../theme';
import format from '../../../../../etc/format';


class DailyCard extends Component {
    _renderListItem(){
        if(this.props.events == undefined || !this.props.events){
            return null
        }

        
        var result = this.props.events.map(item => {
            var stars = []
            for(var i=1; i<= item.star; i++){
                stars.push(<Icon key={'start_'+i} name="md-star" style={styles.star} /> )
            }
            return (
                <View style={styles.listItem} key={item.id}>
                    <View >
                        <Text style={styles.textTime}>{item.startTime}</Text>
                        <Text style={styles.textDuration}>{format.getDisplayDuration(item.duration?item.duration:5)}</Text>
                    </View>
                    <View style={styles.boxStar}>
                        {stars}
                    </View>
                </View>
            )
        })
        return result;
    }

    render(){
        var date = new Moment(this.props.date, ['YYYYMMDD', 'YYYY-MM-DD', 'DD/MM/YYYY']);
        var dayOfWeekDisplay = format.vietnameseDayOfWeek(date.format('d'))
        return (
            <View style={styles.main}>
                <View style={styles.header}>
                    <Text style={styles.title}>{dayOfWeekDisplay + ' - ' + date.format('DD/MM/YYYY')}</Text>
                </View>

                {this._renderListItem()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        paddingHorizontal: 5,
        backgroundColor: "#fff",
        borderColor: Theme.borderColor,
        borderWidth: 1,
        marginBottom: 25
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    title:{
        fontSize: 20,  
        color: Theme.textBlack
    },
    listItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopColor: Theme.borderColor,
        borderTopWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    textTime: {
        fontSize: 16, 
        color: Theme.textBlack
    },
    textDuration: {
        fontSize: 12, 
        color: Theme.textGray
    },
    boxStar: {
        flexDirection: "row"
    },
    star: {
        fontSize: 20,
        color: Theme.mainColor,
        marginLeft:4
    },
})
module.exports = DailyCard;