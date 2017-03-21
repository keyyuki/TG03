import React, { Component } from 'react';
import {View,Dimensions, Modal, StyleSheet, TouchableOpacity, Text} from 'react-native';
import DatePicker from 'react-native-datepicker';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ModalDateRangePicker extends Component{
    static propTypes = {
        show: React.PropTypes.bool.isRequired,
        onCancel: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        startDate: React.PropTypes.string,
        endDate: React.PropTypes.string,
    }

    constructor(props){
        super(props)
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            format: 'DD/MM/YYYY'
        }
    }

    _onStartDateChange(date) {
        this.setState({...this.state, startDate: date})
    }
    _onEndDateChange(date){
        this.setState({...this.state, endDate: date})
    }
    _onCancel(){
        this.props.onCancel()
        this.setState({startDate: this.props.startDate, endDate: this.props.endDate,})
    }
    _onSelect(){
        
        this.props.onSelect(this.state.startDate, this.state.endDate);
    }
    render() {
        
        var customStyle={
            dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
            },
            dateInput: {
                borderWidth: 0,
                marginBottom: 5
            }
        }
        var startDateOption = {
            
        }
        var endDateOption = {
            
        }
        if(this.state.startDate){
            endDateOption.minDate = this.state.startDate
        } 
        if(this.state.endDate){
            startDateOption.maxDate = this.state.endDate
        } 
        return (
            <Modal animationType={"slide"}
                transparent={true}
                visible={this.props.show}
                onRequestClose={() => {this.props.onClose()}}>
                <View style={styles.background}>
                    <View style={styles.overlay}/>
                    <View style={styles.mainContent}>
                        <View style={styles.mainContentContent}>
                            <Text>Từ ngày</Text>
                            <DatePicker
                                
                            date={this.state.startDate}
                            mode="date"
                            placeholder="Từ ngày"
                            format={this.state.format}
                            
                            confirmBtnText="Chọn"
                            cancelBtnText="Hủy"
                            customStyles={customStyle}
                            //maxDate={this.state.endDate}
                            onDateChange={(date) => {this._onStartDateChange(date)}}
                            {...startDateOption}
                            />
                        <Text>Đến ngày</Text>
                            <DatePicker
                                
                            date={this.state.endDate}
                            mode="date"
                            placeholder="Đến ngày"
                            format={this.state.format}
                            
                            confirmBtnText="Chọn"
                            cancelBtnText="Hủy"
                            customStyles={customStyle}
                            //minDate={this.state.startDate}
                            onDateChange={(date) => {this._onEndDateChange(date)}}
                            {...endDateOption}
                            />
                        </View>

                        
                        <View style={{flexDirection:"row", borderTopWidth: 1,
                                borderTopColor: '#ddd', marginTop: 10}}>
                            <TouchableOpacity style={{
                                flex:1,
                                height: 44,
                                
                                borderRightWidth:1,
                                borderRightColor: '#ddd',
                                alignItems: "center",
                                justifyContent:"space-around"

                            }} onPress={() => {this._onCancel()}}>
                                <Text>HỦY</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex:1,
                                height: 44,
                                
                                alignItems: "center",
                                justifyContent:"space-around"

                            }} onPress={() => {this._onSelect()}}>
                                <Text style={{color:"#5cb85c"}}>CHỌN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    background:{
        width:deviceWidth,
        height:deviceHeight,
        alignItems: "center",
        justifyContent: "space-around",
        position:"relative"
    },
    overlay:{
        position: "absolute",
        width:deviceWidth,
        height:deviceHeight,
        top:0,
        left:0,
        backgroundColor: "#000",
        opacity: 0.8,
        zIndex:0
    },
    mainContent: {
        backgroundColor: "white",
        flexDirection: "column",
        zIndex:1,
        
        width: deviceWidth - 60,
        borderRadius: 10
    },
    mainContentContent: {
        
        paddingHorizontal: 20,
        paddingTop:40,
        paddingBottom: 10
    },
    iconDate: {
        position: 'absolute',
        left: 0,
        top: 4,
        marginLeft: 0
    }
})
module.exports = ModalDateRangePicker;