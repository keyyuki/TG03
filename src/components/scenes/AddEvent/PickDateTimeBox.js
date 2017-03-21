import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
    changeNavigation,
    eventChangeTime,

} from '../../../actions';
import { View, Slider,Text, Picker,Modal, TouchableHighlight, Dimensions} from 'react-native';
import {
    Button,
    Icon,
    H3,
    
    } from 'native-base';
import DatePicker from 'react-native-datepicker';
import styles from './style';
import RepeatCalendarModal from './RepeatCalendarModal'
import Moment from 'moment'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class PickDateTimeBox extends Component{
    constructor(props){
        super(props);
        let moment =  Moment(this.props.startTimeStamp, 'X');

        this.state = {
            ...{},
            id: this.props.id,
            date: moment.format('DD/MM/YYYY'),
            startTimeStamp: this.props.startTimeStamp,
            endTimeStamp: this.props.endTimeStamp,
            duration: this.props.duration,
            repeat: null,
            showCustomRepeatCalendar: false
        }
    }

    _displayDuration(duration){
        let hour = Math.floor(duration / 60);
        let minute = duration % 60;
        let result = '';
        if(hour){
            result += hour.toString() + ' giờ ';
        }
        if(minute){
            result += minute.toString() +' phút'
        }
        return result;
    }
    _onDurationChange(duration){
        if(duration){
            let endTimeStamp = this.state.startTimeStamp + (duration * 60);
            this.setState({
                duration: duration,
                endTimeStamp: endTimeStamp
            });
        } else {
            this.setState({
                duration: 0,
                endTimeStamp: null
            });
        }

    }
    _onDateChange(value){
        // đổi date của cả startTimeStamp
        let startTimeMoment = Moment(this.state.startTimeStamp, 'X');
        let timeDisplay = startTimeMoment.format('hh:mm A');
        startTimeMoment = Moment(value + ' ' + timeDisplay, 'DD/MM/YYYY hh:mm A');

        // check nếu có duration, cũng phải thay đổi cả endTimeStamp
        if(this.state.duration){
            let endTimeStamp = startTimeMoment.unix() + (this.state.duration * 60)
            this.setState({
                date: value,
                startTimeStamp: startTimeMoment.unix(),
                endTimeStamp: endTimeStamp,
            });
        } else {
            this.setState({
                date: value,
                startTimeStamp: startTimeMoment.unix(),
            })
        }
        
    }
    _onStartTimeChange(value){
        let startTimeMoment = Moment(this.state.date + ' ' + value, 'DD/MM/YYYY hh:mm A');

        // check nếu có duration, cũng phải thay đổi cả endTimeStamp
        if(this.state.duration){
            let endTimeStamp = startTimeMoment.unix() + (this.state.duration * 60)
            this.setState({
                startTimeStamp: startTimeMoment.unix(),
                endTimeStamp: endTimeStamp,
            });
        } else {
            this.setState({
                startTimeStamp: startTimeMoment.unix(),
            })
        }
    }
    _onEndTimeChange(value){
        let endTimeMoment = Moment(this.state.date + ' ' + value, 'DD/MM/YYYY hh:mm A');
        let endTimeStamp = endTimeMoment.unix();

        if(endTimeStamp <= this.state.startTimeStamp){
            this.setState({
                endTimeStamp: null,
                duration:0
            });
        } else {
            this.setState({
                endTimeStamp: endTimeStamp,
                duration: Math.floor((endTimeStamp - this.state.startTimeStamp) / 60)
            });
        }
        
    }
    _onChangeRepeatCalendar(value){
        
        if(value=='none'){
            return this.setState({repeat: null});
        }
        if(value=='CUSTOM'){
            return this.setState({showCustomRepeatCalendar: true})
        }
        return this.setState({repeat:{type: value}});
    }
    _onChangeCustomRepeatCalendar(dayOfWeek, endDate){
        if(dayOfWeek.length){
            this.setState({repeat:{type: 'CUSTOM', data:{
                    dayOfWeek: dayOfWeek, endDate: endDate
                }},
                showCustomRepeatCalendar: false
            });
        } else {
            this.setState({repeat: null});
        }
    }
    _openCustomRepeatCalendar(){
        this.setState({
            showCustomRepeatCalendar: true
        })
    }
    _getCustomRepeatCalendarDescription(){
        let result = '';
        if(this.state.repeat && this.state.repeat.data){
            let mapDayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            result = 'Mỗi '
            let arr =[]
            this.state.repeat.data.dayOfWeek.map((index) => {
                arr.push(mapDayOfWeek[index])
            })
            result += arr.join(', ');
            if(this.state.repeat.data.endDate){
                result += ' kéo dài đến ' + this.state.repeat.endDate
            }
        }
        return result;
    }
    _onSave(){
        let repeat = null
       
        if(this.state.repeat){
            repeat = this.state.repeat;
        }
        this.props.eventChangeTime(this.props.id, 
            this.state.date, this.state.startTimeStamp,  this.state.endTimeStamp,
            this.state.duration, repeat)
        return this.props.backToAddScene();
    }
    _onBack(){
        this.props.backToAddScene()
    }
    render(){
        let endTimeMoment = null
        let endTimeDisplay = '';
        let startTimeMoment = Moment(this.state.startTimeStamp, 'X');
        if(this.state.endTimeStamp){
            endTimeMoment = Moment(this.state.endTimeStamp, 'X');
            endTimeDisplay = endTimeMoment.format('hh:mm A')
        } 
        
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
                alignSelf: 'flex-start',
                lineHeight: 25
            }
        }
        return (
            <View style={styles.PickDateTimeBox_Main}>
                <View style={styles.PickDateTimeBox_Content}>
                    <View style={{marginBottom:20}}>
                        <H3>
                            Chọn thời điểm diễn ra sự kiện
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
                            onDateChange={(value) => this._onDateChange(value)}
                            />
                        </View>
                    </View>
                    <View style={styles.calendarBox_row}>
                        <View style={styles.calendarBox_formLabel}><Text style={{lineHeight: 25}}>Bắt đầu:</Text></View>
                        <View style={styles.calendarBox_formInput}>
                            <DatePicker
                            format="hh:mm A"
                            showIcon={false}
                            mode="time"
                            date={startTimeMoment.format('hh:mm A')}
                            customStyles={dateInputStyle}
                            onDateChange={(value) => this._onStartTimeChange(value)}
                            />
                        </View>
                    </View>
                    <View style={[styles.calendarBox_row, {flexDirection:'column', }]}>
                        <Text>Diễn ra trong</Text>
                        <Slider step={15} minimumValue={0} maximumValue={120} value={this.state.duration} 
                        style={{width:250, marginVertical:10}} onValueChange={
                            (value) => {this._onDurationChange(value)}
                        }/>
                        <Text>{this._displayDuration(this.state.duration)}</Text>
                    </View>
                    
                    <View style={styles.calendarBox_row}>
                        <View style={styles.calendarBox_formLabel}><Text style={{lineHeight: 25}}>Kết thúc:</Text></View>
                        <View style={styles.calendarBox_formInput}>
                            <DatePicker
                            format="hh:mm A"
                            showIcon={false}
                            mode="time"
                            date={endTimeDisplay}
                            placeholder="Chọn"
                            customStyles={dateInputStyle}
                            onDateChange={(value) => this._onEndTimeChange(value)}
                            />
                        </View>
                    </View>
                    <View style={styles.calendarBox_row}>
                        <View style={styles.calendarBox_formLabel}><Text style={{lineHeight: 25}}>Lặp lại:</Text></View>
                        <View style={styles.calendarBox_formInput}>
                            <Picker style={{color:'blue'}}
                            selectedValue={this.state.repeat ? this.state.repeat.type : 'none'}
                            onValueChange={(value) => this._onChangeRepeatCalendar(value)}
                            mode="dropdown"
                            >
                                <Picker.Item label="Không lặp lại" value="none" />
                                <Picker.Item label="Hàng ngày" value="ED" />
                                <Picker.Item label="Hàng tuần" value="EW" />
                                <Picker.Item label="Thứ 2,3,4,5,6 hàng tuần" value="WD1" />
                                <Picker.Item label="Thứ 2,3,4,5,6,7 hàng tuần" value="WD2" />
                                <Picker.Item label="Hàng tháng" value="EM" />
                                <Picker.Item label="Tùy chỉnh" value="CUSTOM" />
                            </Picker>
                            <TouchableHighlight style={{padding:0, margin:0}}
                            onPress={() => this._openCustomRepeatCalendar()}>
                                <Text style={{color:'blue'}}>{this._getCustomRepeatCalendarDescription() ? this._getCustomRepeatCalendarDescription() : ''}</Text>
                            </TouchableHighlight>
                        </View>
                        
                        
                    </View>
                    <View style={[styles.PickDateTimeBox_Row, {flexDirection: 'row',justifyContent:'space-around', width:300}]}>
                        <Button danger onPress={() => this._onBack()}><Icon name="md-arrow-back"/><Text>Hủy</Text></Button>
                        <Button success onPress={() => this._onSave()}><Icon name="md-checkmark"/><Text>Chọn</Text></Button>
                    </View>
                </View>

                <RepeatCalendarModal visible={this.state.showCustomRepeatCalendar} 
                    onClose={() => {this.setState({showCustomRepeatCalendar:false})}} 
                    onSave={(dayOfWeek, endDate) => this._onChangeCustomRepeatCalendar(dayOfWeek, endDate)}
                />
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        backToAddScene : () => {dispatch(changeNavigation('pop'))},
        eventChangeTime: (id, date, startTimeStamp, endTimeStamp, duration, repeat) => {
            dispatch(eventChangeTime(id, date, startTimeStamp, endTimeStamp, duration, repeat))}
    }
}
const mapStateToProps = state => {
    return{
        id: state.event.id,
        date: state.event.date,
        startTimeStamp: state.event.startTimeStamp,
        endTimeStamp: state.event.endTimeStamp,
        duration: state.event.duration
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PickDateTimeBox);
