import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, ListView, Dimensions, TouchableOpacity, PanResponder, ScrollView, Text} from 'react-native';
import {  Icon, } from 'native-base';
import Moment from 'moment';
import DatePicker from 'react-native-datepicker';
import {eventListSetDate, eventListFetchData} from '../../../actions';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class DateSelector extends Component{
    constructor(props){
        super(props)
    }

    _onPressBackBtn(){
        var date = new Moment(this.props.date, 'DD/MM/YYYY')
        date.subtract(1, 'days')
        this.props.changePointerDate(date.format('DD/MM/YYYY'))
    }
    _onPressForwardBtn(){
        var date = new Moment(this.props.date, 'DD/MM/YYYY')
        date.add(1, 'days')
        this.props.changePointerDate(date.format('DD/MM/YYYY'))
    }
    _onDateChange(date){
        this.props.changePointerDate(date)
    }
    render(){
        let dateInputStyle = {
            dateTouchBody:{
                height:30
            },
            dateInput: {
                borderWidth: 0,
                height: 20,
                margin:0,
            },
            dateText: {
                color: 'black',
                fontWeight:"bold",
                alignSelf: 'center',
                lineHeight: 20,
                fontSize:20
            },
            btnText:{
                justifyContent: 'center'
            },
            disabled: {
                backgroundColor: "transparent", 
            },
            placeholderText: {
                color: 'gray',
                alignSelf: 'flex-start',
                lineHeight: 25
            }
        }
        var h = 30;
        return (
            <View style={{height: h, flexDirection:"row", alignItems: "center", justifyContent:"space-between", marginBottom:10}}>
                
                <View style={{height:h, width: 50, alignItems:"flex-start", }}>
                    <TouchableOpacity onPress={() => this._onPressBackBtn()}>
                    <Icon name="ios-arrow-back-outline"/>
                    </TouchableOpacity>
                </View>
                
                <View style={{height:h, }}>
                    <DatePicker
                        format="DD/MM/YYYY"
                        showIcon={false}
                        mode="date"
                        date={this.props.date}
                        customStyles={dateInputStyle}
                        style={{margin:0, height:30, padding:0, }}
                        onDateChange={(value) =>{this._onDateChange(value)}}
                        />
                </View>
                
                <View style={{height:h, width: 50, alignItems:"flex-end"}}>
                    <TouchableOpacity onPress={() => this._onPressForwardBtn()}>
                    <Icon name="ios-arrow-forward-outline"/>
                    </TouchableOpacity>
                </View>
                
            </View>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        date: state.eventList.date,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changePointerDate: (date) => {
            dispatch(eventListSetDate(date))
            dispatch(eventListFetchData(date))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);