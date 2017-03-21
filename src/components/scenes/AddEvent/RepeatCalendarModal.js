import React, {Component} from 'react';
import { connect } from 'react-redux';
import { 
    View, 
    Slider, 
    Switch,
Modal,
TouchableHighlight,
Text,
    Dimensions
} from 'react-native';
import {
    
    H3,
   
} from 'native-base';
import DatePicker from 'react-native-datepicker';

import {eventSetNext, changeNavigation} from '../../../actions';
import styles from './style';
import Moment from 'moment'

class RepeatCalendarModal extends Component{
    constructor(props){
        super(props)
        this.state = {
            ...{},
            visible: this.props.visible,
            dayOfWeek: [],
            endDate: null
        }
        this.visible = this.props.visible
    }
    

    _onSave() {
        this.props.onSave(this.state.dayOfWeek, this.state.endDate)
        this.setState({visible: false})
    }
    
    _pickDayOfWeek(day) {
        var posion = this.state.dayOfWeek.indexOf(day);
        var dayofweekpicked =  this.state.dayOfWeek.concat([]) ;
        if(posion === -1){
            dayofweekpicked.push(day);
            this.setState({dayOfWeek: dayofweekpicked});
        } else {
            dayofweekpicked.splice(posion, 1);
            this.setState({dayOfWeek: dayofweekpicked});
        }
    }

    render(){
        let dateInputStyle = {
            dateInput: {
                borderWidth: 0,
                height: 30,
                backgroundColor: "transparent",
                padding: 5
            },
            dateText: {
                color: 'blue',
                alignSelf: 'flex-start',
                lineHeight: 30
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
        var arr = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return (
            <Modal animationType={"slide"}
            transparent={false}
            visible={this.props.visible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            style={{width: 200}}
            >
                <View style={styles.modalOutLine} >
                    <View style={styles.modalBox}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight:'bold'
                        }}>Ngày trong tuần</Text>
                        <View style={{
                            alignSelf: 'stretch',
                        flexWrap: 'wrap',flexDirection: 'row', }}>
                        
                        {
                             arr.map((display, i) => {
                                return (<TouchableHighlight
                                    key={i}
                                    style={this.state.dayOfWeek.indexOf(i) !== -1 ? styles.roundDatePickerActive : styles.roundDatePicker}
                                    onPress={() => {this._pickDayOfWeek(i)}}
                                >
                                    <Text style={{color:( this.state.dayOfWeek.indexOf(i) !== -1 ? "white" : "black") }}>{display}</Text>
                                </TouchableHighlight>)
                            })
                        }
                        </View>
                        <Text style={{
                            fontSize: 18,
                            fontWeight:'bold'
                        }}>Kéo dài đến</Text>
                         <View style={{
                            alignSelf: 'stretch',
                        flexWrap: 'wrap',flexDirection: 'row', }}>
                            
                            <DatePicker
                            format="DD/MM/YYYY"
                            showIcon={false}
                            mode="date"
                            date={this.state.endDate}
                            placeholder="Không kết thúc"
                            customStyles={dateInputStyle}
                            onDateChange={(value) => {this.setState({endDate: value})}}
                            />
                            
                        </View>
                        <View style={[styles.divider, {height:1, alignSelf: 'stretch'}]}/>
                        <View style={{alignSelf: 'stretch', justifyContent :'flex-end', flexDirection:"row"}}>
                            <TouchableHighlight  onPress={() => {
                                this.props.onClose()
                            }}>
                                <Text style={{padding:10}}>HỦY</Text>
                            </TouchableHighlight>
                            <TouchableHighlight  onPress={() => {this._onSave()}}>
                                <Text style={{padding:10, color:"red"}}>XONG</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        visible: state.event.dateTimeBox.showCustomRepeatModal
    }
}
export default connect()(RepeatCalendarModal);
