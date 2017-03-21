import React, {Component} from 'react';
import { connect } from 'react-redux';
import { 
    View, 
    Slider, 
    Switch,
    Dimensions
} from 'react-native';
import {
    Button,
    Icon,
    H3,
    Text,
     Form, Item, Input, Label, Picker
} from 'native-base';
import DatePicker from 'react-native-datepicker';

import {eventSetNext, changeNavigation} from '../../../actions';
import styles from './style';
import Moment from 'moment'

class AddCalendarBox extends Component{
    constructor(props){
        super(props);
        let moment = new Moment();
        let date = moment.format('DD/MM/YYYY')
        let time = null;
        let isAllDay = true;
        if(this.props.nextEvent){
            date = this.props.nextEvent.date;
            time = this.props.nextEvent.time;
            if(time){
                isAllDay = false
            }
        }
        
        this.state = {
            ...{},
            id: '',
            date: date,
            time: time,
            isAllDay: isAllDay,
            
        }
    }
    _onDateChange(date){
        this.setState({date: date})
    }
    _onAllDaySwicthChange(){
        if(this.state.isAllDay){ // chuyển từ AllDay -> giờ cụ thể
            let moment = new Moment();
            this.setState({
                isAllDay: !this.state.isAllDay,
                time: moment.format('hh:mm A')
            })
        } else {
            this.setState({
                isAllDay: !this.state.isAllDay,
                time: null
            })
        }
        
    }
    _onTimeChange(time){
        this.setState({time: time})
    }
    _onSave(){
        this.props.eventSetNext(this.state.date, this.state.time)
        return this.props.backToAddScene()
    }
    _onBack(){
        return this.props.backToAddScene()
    }
    
    render(){
        let dateInputStyle = {
            dateInput: {
                borderWidth: 0,
                height: 25,
                backgroundColor: "transparent"
            },
            dateText: {
                color: 'blue',
                alignSelf: 'flex-start',
                lineHeight: 25
            },
            disabled: {
                backgroundColor: "transparent", 

            },
            placeholderText: {
                color: 'gray',
                alignSelf: 'flex-start'
            }
        }
        return (
            <View style={styles.calendarBox_main}>
                <View style={styles.calendarBox_content}>
                    <View style={{ marginBottom: 20 }}>
                        <H3>
                            Lịch hẹn tiếp theo
                        </H3>
                    </View>
                    <View style={styles.calendarBox_row}>
                        <View style={styles.calendarBox_formLabel}><Text style={{lineHeight: 25}}>Ngày:</Text></View>
                        <View style={styles.calendarBox_formInput}>
                            <DatePicker
                            format="DD/MM/YYYY"
                            showIcon={false}
                            mode="date"
                            date={this.state.date}
                            customStyles={dateInputStyle}
                            onDateChange={(date) => this._onDateChange(date)}
                            />
                        </View>
                    </View>
                    <View style={styles.calendarBox_row}>
                        <View style={styles.calendarBox_formLabel}><Text style={{lineHeight: 25}}>Giờ:</Text></View>
                        <View style={[styles.calendarBox_formInput, {flex: 1}]}>
                            <DatePicker
                            format="hh:mm A"
                            showIcon={false}
                            mode="time"
                            placeholder="Cả ngày"
                            date={this.state.time}
                            customStyles={dateInputStyle}
                            disabled={this.state.isAllDay}
                            onDateChange={(time) => this._onTimeChange(time)}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <Switch style={{marginTop:10}}
                                value={!this.state.isAllDay} onValueChange={() => this._onAllDaySwicthChange()}/>

                        </View>
                    </View>
                    
                    <View>
                        <View style={[styles.PickDateTimeBox_Row, {flexDirection: 'row',justifyContent:'space-around', width:300}]}>
                            <Button danger onPress={() => this._onBack()}><Icon name="md-arrow-back"/><Text>Hủy</Text></Button>
                            <Button success onPress={() => this._onSave()}><Icon name="md-checkmark"/><Text>Chọn</Text></Button>
                        </View>

                    </View>

                </View>
            </View>

        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        nextEvent: state.event.nextEvent
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        eventSetNext: (date, time) => {
            dispatch(eventSetNext(date, time))
        },
        backToAddScene : () => {dispatch(changeNavigation('pop'))},
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddCalendarBox);