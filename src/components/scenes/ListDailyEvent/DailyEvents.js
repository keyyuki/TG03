import React, { Component } from 'react';
import { connect } from 'react-redux';
import {View, ListView, Dimensions, TouchableOpacity, PanResponder, ScrollView} from 'react-native';
import { Container,H3, Header, Title, Content, Button, Icon, List, ListItem, Text,Card,CardItem } from 'native-base';
import Text12 from './Text12';
import Event from './Event'
import Moment from 'moment';
import {eventListSetDate, eventListFetchData} from '../../../actions';
import EventModel from '../../../model/EventModel';
import panresponderMoveDetect from '../../../etc/panresponderMoveDetect';
import Realm from 'realm';
import DateSelector from './DateSelector'


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class DailyEvents extends Component {
    constructor(props){
        super(props);
        this.state = {
            scroll: true
        }
        this._prevDate = this.props.date;
        this._prevForceUpdate 
    }
    
    componentDidMount(){
        this.props.fetchData(this.props.date);
    }
    

    componentWillMount() {
        
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => panresponderMoveDetect(gestureState),
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                var vector = gestureState.dx / gestureState.dy;
                if(vector > 1){
                    this.setState({scroll: false})
                }

            },
            onPanResponderRelease: (evt, gestureState) => {
                var relativeGestureDistance = gestureState.dx / deviceWidth, vx = gestureState.vx;
                if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0.1 && vx >= 1e-6)) {
                    this._moveLeft()
                }
                if (relativeGestureDistance < -0.5 || (relativeGestureDistance < -0.1 && vx <= -1e-6)) {
                    this._moveRight()
                }

            },
        })
    }

    _moveLeft(){
        this.setState({scroll: true})
        var date = new Moment(this.props.date, 'DD/MM/YYYY')
        date.subtract(1, 'days')
        this.props.changePointerDate(date.format('DD/MM/YYYY'))
        
    }
    _moveRight(){
        this.setState({scroll: true})
        var date = new Moment(this.props.date, 'DD/MM/YYYY')
        date.add(1, 'days')
        this.props.changePointerDate(date.format('DD/MM/YYYY'))
        
    }
    

    render(){
        return (
            <ListView {...this._panResponder.panHandlers} 
                style={{minHeight:deviceHeight-100, backgroundColor:'white'}}
                //renderHeader={() =>  <H3 style={{alignSelf:'center'}}>{this.props.date}</H3>}
                renderHeader={() =>  <DateSelector date={this.props.date} />}
                renderRow={(item) => <Event key={item.id} item={item}/>}
                dataSource={this.props.dataSource}
                initialListSize={4}
                pageSize={4}
                scrollEnabled={this.state.scroll}
                enableEmptySections={true}
            />
            
        )

    }
}
DailyEvents.propTypes = {
    changePointerDate: React.PropTypes.func,
    date: React.PropTypes.string
}
const mapStateToProps = (state, ownProps) => {
    return {
        date: state.eventList.date,
        dataSource: state.eventList.dataSource
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changePointerDate: (date) => {
            dispatch(eventListSetDate(date))
            dispatch(eventListFetchData(date))
        },
        fetchData: (date) => {
            dispatch(eventListFetchData(date))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DailyEvents);