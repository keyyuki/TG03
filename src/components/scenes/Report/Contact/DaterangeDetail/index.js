import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Dimensions, TouchableOpacity, ScrollView, Text, StyleSheet } from 'react-native';
import { Container,  Header, Icon, Title, Button, Content} from 'native-base';
import OverViewCard from './OverViewCard';
import ContactCard from './ContactCard';
import ModalDateRangePicker from '../ModalDateRangePicker';

import {closeDrawer, openDrawer, changeNavigation} from '../../../../../actions';
import {reportcontactChangeContactId} from '../../../../../actions/ReportActions';

import ReportModel from '../../../../../model/ReportModel';
import ContactModel from '../../../../../model/ContactModel';
import EventModel from '../../../../../model/EventModel'

import Theme from '../../../../../theme';

import Moment from 'moment';

const getInitialState = () => {
    var currentDateTime = new Moment();
    var result = {
        endDate: currentDateTime.format('DD/MM/YYYY'),
        startDate: currentDateTime.subtract(7, 'days').format('DD/MM/YYYY')
    };
    return result;
}   


class DaterangeDetail extends Component{
    /*static propTypes = {
        startDate: React.PropTypes.string,
        endDate: React.propTypes.string
    }*/
    constructor(props){
        super(props);
        var initialState = getInitialState();
        this.state = {
            startDate: this.props.startDate == undefined ? initialState.startDate : this.props.startDate,
            endDate: this.props.endDate == undefined ? initialState.endDate : this.props.endDate,
            showDaterangeModal: false,
            overView: {
                totalCount: 0,
                totalDuration: 0,
                mostCountContact: null,
                mostLongContact: null,
                mostEffectiveContact: null
            },
            contactsDetail: null,

        }

    }

    async loadData(startDate, endDate)  {
        try{
            return ReportModel.getContactDaterangeDetailOverviewData(startDate, endDate)
        } catch(error) {
            console.log('ERROR', error);
            alert('Có lỗi trong quá trình xử lí!')
            throw error;
        }
        
    }

    componentDidMount() {
        this.loadData(this.state.startDate, this.state.endDate).then(response => {
            this.setState({
                overView: {
                    totalCount: response.totalCount,
                    totalDuration: response.totalDuration,
                    mostCountContact: response.theMostCountContact,
                    mostLongContact: response.theMostDurationContact,
                    mostEffectiveContact: response.theMostEffectiveContact
                },
                contactsDetail: response.contacts
            })
        }).done()
    }


    _onChangeDateRange(startDate, endDate){
        
        if(startDate != this.state.startDate || endDate != this.state.endDate){
            this.setState({
                startDate: startDate,
                endDate: endDate,
                showDaterangeModal: false
            })
            this.loadData(this.state.startDate, this.state.endDate).then(response => {
                this.setState({
                    overView: {
                        totalCount: response.totalCount,
                        totalDuration: response.totalDuration,
                        mostCountContact: response.theMostCountContact,
                        mostLongContact: response.theMostDurationContact,
                        mostEffectiveContact: response.theMostEffectiveContact
                    },
                    contactsDetail: response.contacts
                })
            }).done()
        } else {
            this.setState({
                
                showDaterangeModal: false
            })
        }
    }

    _onPressContact(contactId){
        this.props.viewDetail(contactId)
    }

    renderDetailItem(contactId, contactDetail){
        return (
            <ContactCard 
                key={'detail_' + contactId}
                ref={'detail_' + contactId}
                contactId={contactId}
                totalCount={contactDetail.count}
                totalDuration={contactDetail.duration}
                totalEffective={contactDetail.effective}
                onPressViewDetail={() => { this._onPressContact(contactId)}}
            />
        )
    }

    renderDetailList(){
        if(!this.state.contactsDetail){
            return null
        }
        var result = [];
        for(var contactId in this.state.contactsDetail){
            
            var contactDetail = this.state.contactsDetail[contactId]
            result.push(this.renderDetailItem(contactId, contactDetail))
        }

        return result
    }
    
    render(){
        return (
            <Container style={{backgroundColor:Theme.backgroundColor}}>
                <Header style={{backgroundColor:Theme.mainColor}}>
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
                <Content>
                    <ScrollView>
                    <OverViewCard 
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        {...this.state.overView}
                    />
                    <View style={{
                        flexDirection:"column",
                        marginTop: 25
                    }}>
                        {this.renderDetailList()}

                    </View>
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
        viewDetail: (contactId) => {
            dispatch(reportcontactChangeContactId(contactId))
            dispatch(changeNavigation('push', {key: 'report-contact-detail'}))
        },
        closeDrawer: () => dispatch(closeDrawer()),
        openDrawer: () => dispatch(openDrawer()),
        
    }
}

module.exports = connect(null, mapDispatchToProps) (DaterangeDetail);