import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, ListView, Dimensions, Modal} from 'react-native';
import { Container,H3, Header, Title, Content, Button, Icon, List, ListItem, Text, Fab } from 'native-base';
import {closeDrawer, openDrawer, changeNavigation, eventListSetDate, eventListFetchData} from '../../../actions';
import DailyEvents from './DailyEvents'
import Moment from 'moment';

import theme from '../../../theme'




class ListDailyEvent extends Component {
    constructor(props){
        super(props)
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource : ds.cloneWithRows([1,2,3])
        }
    }
    
    _onPressHome(){
        var date = new Moment()
        
        this.props.changePointerDate(date.format('DD/MM/YYYY'))
    }
    
    render(){
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dataSource = ds.cloneWithRows(['row 1', 'row 2', 'row3']);
        
        return (
            <Container style={{backgroundColor:'white'}}>
                
                <Header style={{backgroundColor:theme.mainColor}}>
                    <Title>Việc trong ngày</Title>
                    <Button transparent onPress={() => {this.props.openDrawer()}}>
                        <Icon name='md-menu' style={{
                            color: 'white'
                        }}/>
                    </Button>
                    <Button transparent onPress={() => {this._onPressHome()}}>
                        <Icon name='md-home' style={{
                            color: 'white'
                        }}/>
                    </Button>
                </Header>
                <Content padder>
                    <DailyEvents />
                    
                </Content>

                <Fab 
                style={{ backgroundColor: '#5067FF' }}
                position="bottomRight"
                onPress={() => this.props.changeNavigation('push', {key:'add-event'})}
                >
                    <Icon name="md-add" />
                </Fab>
                
               
            </Container>
        )
        
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closeDrawer: () => dispatch(closeDrawer()),
        openDrawer: () => dispatch(openDrawer()),
        changeNavigation: (changeType, route) => {dispatch(changeNavigation(changeType, route))},
        changePointerDate: (date) => {
            dispatch(eventListSetDate(date))
            dispatch(eventListFetchData(date))
        },
    }
}
export default connect(null, mapDispatchToProps)(ListDailyEvent)