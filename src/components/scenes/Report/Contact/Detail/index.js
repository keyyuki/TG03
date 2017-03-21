import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, Dimensions, TouchableOpacity, ScrollView, ListView, Text, StyleSheet,Image } from 'react-native';
import { Container, Icon, Title, Button, Content} from 'native-base';

import {changeNavigation} from '../../../../../actions';
import {reportcontactdetailLoadOverviewData, reportcontactdetailLoadContact} from '../../../../../actions/ReportActions';


import Header from './Header';
import OverviewCard from './OverviewCard'
import DailyCard from './DailyCard'
import Theme from '../../../../../theme';


class Detail extends Component{
    componentDidMount(){
        this.props.loadOverviewData(this.props.contactId);
        this.props.loadEventData(this.props.contactId)
    }



    render() {
        return (
            <Container style={{backgroundColor:Theme.backgroundColor}}>
                <Content>
                    
                        <Header 
                            onPressBackButton={() => {this.props.onBack()}}
                            contact={this.props.contact}
                        />
                        <OverviewCard 
                            totalEvent={this.props.totalEvent}
                            totalDuration={this.props.totalDuration}
                            stars={this.props.stars}
                        />
                    <ListView 
                        dataSource={this.props.dataSource}
                        renderRow={(item) => {
                            return <DailyCard 
                                key={item.date}
                                date={item.date}
                                events={item.events}
                            />
                        }}
                        enableEmptySections={true}
                    >
                        
                        
                    </ListView>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        contactId: state.report.contactDetail.contactId,
        contact: state.report.contactDetail.contact,
        totalEvent: state.report.contactDetail.totalEvent,
        totalDuration: state.report.contactDetail.totalDuration,
        stars: state.report.contactDetail.stars,
        dataSource: state.report.contactDetail.dataSource,
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onBack: () => {
            dispatch(changeNavigation('pop'))
        },
        loadOverviewData: (contactId) => {
            dispatch(reportcontactdetailLoadOverviewData(contactId))
        },
        loadEventData: (contactId) => {
            dispatch(reportcontactdetailLoadContact(contactId))
        }
    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps) (Detail);