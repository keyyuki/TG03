import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View,Dimensions, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Container, H3, Header, Title, Content, Button, Icon, List, ListItem, Fab,
Card, CardItem,  Badge, Text} from 'native-base';
import DatePicker from 'react-native-datepicker'
import ReportModel from '../../../../model/ReportModel';
import ContactModel from '../../../../model/ContactModel';
import EventModel from '../../../../model/EventModel'
import CardBox from './CardBox';
import ModalDateRangePicker from './ModalDateRangePicker';
import {closeDrawer, openDrawer} from '../../../../actions';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ReportByContact extends Component{
    constructor(){
        super();
        this.state = {
            countData : [],
            timeData : [],
            checklistData: [],
            effectiveData: [],
            showDaterangeModal: false,
            startDate: '01/03/2017',
            endDate: '31/03/2017'
        }
    

    }

    async loadCountData(startDate, endDate ) {
        try {
            var matrix = await ReportModel.getContactDashboardData(startDate, endDate);
            
            return matrix;
        } catch (error) {
            console.log('ERROR', error);
            throw error;
        }
    }
    componentDidMount(){
         
        this.loadCountData(this.state.startDate, this.state.endDate).then(response => {
            this.setState({
                countData: response.countData,
                timeData: response.timeData,
                effectiveData: response.effectData
            })
        }).done();

    }

    _onChangeDateRange(startDate, endDate){
        
        if(startDate != this.state.startDate || endDate != this.state.endDate){
            this.setState({
                startDate: startDate,
                endDate: endDate,
                showDaterangeModal: false
            })
            this.loadCountData(startDate, endDate).then(response => {
                this.setState({
                    countData: response.countData,
                    timeData: response.timeData
                })
            }).done();
        } else {
            this.setState({
                
                showDaterangeModal: false
            })
        }
    }
    
    _countMatrixToBoxData(){
        if(!this.state.countData.length){
            return []
        }
        var result = [];
        this.state.countData.map(item => {
            item.leftText = ContactModel.getDisplayName(item.contact)
            item.rightText = item.total + ' lần'
            result.push(item)
        })
        return result;
    }

    _timeMatrixToBoxData(){
        if(!this.state.timeData.length){
            return []
        }
        var result = [];
        this.state.timeData.map(item => {
            item.leftText = ContactModel.getDisplayName(item.contact)
            item.rightText = EventModel.getDisplayDuration(item.total, 'h', 'p')
            result.push(item)
        })
        return result;
    }
    _effectiveMatrixToBoxData(){
        if(!this.state.effectiveData.length){
            return []
        }
        var result = [];
        this.state.effectiveData.map(item => {
            item.leftText = ContactModel.getDisplayName(item.contact)
            item.rightText = ''
            result.push(item)
        })
        return result;
    }


    render(){
        
        return (
            <Container style={{backgroundColor:'#F9F9F9'}}>
                <Header style={{backgroundColor:'#FFB12C'}}>
                    <Title>Báo cáo theo người tham dự</Title>
                    <Button transparent onPress={() => {this.props.openDrawer()}}>
                        <Icon name='md-menu' style={{
                            color: 'white'
                        }}/>
                    </Button>
                    <Button transparent onPress={() => {this.setState({showDaterangeModal:true})}}>
                        <Icon name='md-calendar' style={{
                            color: 'white'
                        }}/>
                    </Button>
                </Header>
                <Content  >
                    <TouchableOpacity 
                        style={{height:40, paddingLeft:10, alignItems: "flex-start", justifyContent:"flex-end"}}
                        onPress={() => {this.setState({showDaterangeModal:true})}}
                    >
                        <Text style={{fontSize:15, fontWeight:"bold"}}>
                            {this.state.startDate + ' - ' + this.state.endDate}
                        </Text>
                    </TouchableOpacity>
                    <ScrollView>
                    <CardBox 
                        title={"Số lần gặp"}
                        dataSource={this._countMatrixToBoxData()}
                    />
                    <CardBox 
                        title={"Thời gian gặp"}
                        dataSource={this._timeMatrixToBoxData()}
                    />
                    <CardBox 
                        title={"Hiệu quả công việc"}
                        dataSource={this._effectiveMatrixToBoxData()}
                    />
                    </ScrollView>
                    <ModalDateRangePicker 
                        show={this.state.showDaterangeModal}
                        onCancel={() => {this.setState({showDaterangeModal: false})}}
                        onSelect={(startDate, endDate) => {
                            this._onChangeDateRange(startDate, endDate)
                        }}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                    />
                    
                </Content>
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeDrawer: () => dispatch(closeDrawer()),
        openDrawer: () => dispatch(openDrawer()),
        
        
    }
}

export default connect(null, mapDispatchToProps)(ReportByContact);