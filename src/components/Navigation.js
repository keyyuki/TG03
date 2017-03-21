
import React, { Component } from 'react';
import { TouchableHighlight, Text, NavigationExperimental} from 'react-native';
import { connect } from 'react-redux';
import  Drawer from 'react-native-drawer';
import SideBar from './Sidebar';
import {closeDrawer, openDrawer, changeNavigation} from '../actions';

import ListEvent from './scenes/ListEvent';
import AddEvent from './scenes/AddEvent';
import PickDateTimeBox from './scenes/AddEvent/PickDateTimeBox';
import AddCalendarBox from './scenes/AddEvent/AddCalendarBox';
import ListDailyEvent from './scenes/ListDailyEvent';
import ReportContactDashBoard from './scenes/Report/Contact';
import ReportContactDaterangeDetail from './scenes/Report/Contact/DaterangeDetail';
import ReportContactDetail from './scenes/Report/Contact/Detail';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

class Navigation extends Component{
    constructor(props){
        super(props);
        this.state = {
            drawer: {
                isOpen :   this.props.isOpenDrawer
            }
        }

        this._onPopRoute = this.props.changeNavigation.bind(null, 'pop')
    }

    _openDrawer(){
        this._drawer.open();
        this.props.openDrawer();
    }

    _renderScreen(sceneProps){
        switch (sceneProps.scene.route.key) {
            case 'day-by-day-list':
                return (<ListEvent />)
            case 'add-event':
                return (<AddEvent />)
            case 'add-event-pick-datetime':
                return (<PickDateTimeBox />)
            case 'add-event-add-calendar':
                return (<AddCalendarBox />);
            case 'list-event-daily':
                return (<ListDailyEvent />);
            case 'report-contact':
                return (<ReportContactDashBoard />);
            case 'report-contact-daterange-detail':
                return (<ReportContactDaterangeDetail />);
            case 'report-contact-detail':
                return (<ReportContactDetail />);
            default:
                return (<ListDailyEvent />)
        }
    }

    render(){
        return (
            <Drawer
                type="overlay"
                tweenDuration={150}
                ref={(ref) => {this._drawer = ref}}
                content={<SideBar  />}
                tapToClose
                onClose={() => {this.props.closeDrawer()}}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                styles={{
                    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, zIndex:10},
                    main: {paddingLeft: 0},
                    
                }}
                open={this.props.isOpenDrawer}
            >
                <NavigationCardStack
                    onNavigateBack={this._onPopRoute}
                    navigationState={this.props.navigationState}
                    renderScene={this._renderScreen}
                  />

            </Drawer>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    openDrawer: () => dispatch(openDrawer()),
    changeNavigation: (changeType, route) => dispatch(changeNavigation(changeType, route))
  };
}
const mapStateToProps = state => {
    return {
        isOpenDrawer : state.drawer.isOpen,
        navigationState: state.navigation
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
