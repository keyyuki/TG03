import React, { Component  } from 'react';
import { Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Icon, View } from 'native-base';
import {changeNavigation, closeDrawer} from '../../actions'
import styles from './style';
const bgImage = require('../../../img/bg.png')

class SideBar extends Component {
   
    constructor(props) {
        super(props);
        console.log('styles.drawerCover',styles)
    }
    render(){
        return (
            <View style={styles.sidebar} elevation={5}>
                
                <Image style={styles.drawerCover} resizeMode="cover" source={bgImage}>

                </Image>
                <List>
                    <ListItem button iconLeft onPress={() => {
                        this.props.navigateTo({key:'list-event-daily'});
                        this.props.closeDrawer()
                    }} >
                        <Icon name="md-list" />
                        <Text style={styles.text}>Danh sách sự kiện trong ngày</Text>
                    </ListItem>
                    <ListItem itemDivider>
                        <Text>Báo cáo</Text>
                    </ListItem>
                    <ListItem button iconLeft onPress={() => {
                            this.props.navigateTo({key:'report-contact-daterange-detail'});
                            this.props.closeDrawer()
                        }} >
                            <Icon name="md-person" />
                            <Text style={styles.text}>Theo người tham dự</Text>
                    </ListItem>
                </List>
            </View>
        )
    }
}


function mapDispatchToProps(dispatch) {
  return {
    navigateTo: (route) => dispatch(changeNavigation('push', route)),
    closeDrawer: () => dispatch(closeDrawer())
  };
}

const mapStateToProps = state => ({

});

export default connect(null, mapDispatchToProps)(SideBar);
