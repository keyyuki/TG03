const React = require('react-native');

const {StyleSheet, Platform, Dimensions} = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
    sidebar: {
        flex: 1,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
    drawerCover: {
        alignSelf: 'stretch',
        // resizeMode: 'cover',
        height: 174,
        width: null,
        position: 'relative',
        marginBottom: 10,
        backgroundColor: '#ff5722'
    },
    drawerImage: {
        position: 'absolute',
        
        left: (Platform.OS === 'android')
            ? deviceWidth / 10
            : deviceWidth / 9,
        
        top: (Platform.OS === 'android')
            ? deviceHeight / 13
            : deviceHeight / 12,
        width: 210,
        height: 75,
        resizeMode: 'cover'
    },
    listItemContainer : {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconContainer : {
        width: 37,
        height: 37,
        borderRadius: 18,
        marginRight: 12,
        paddingLeft: 11,
        paddingTop: (Platform.OS === 'android')
            ? 7
            : 5
    },
    sidebarIcon : {
        fontSize: 21,
        color: '#fff',
        lineHeight: (Platform.OS === 'android')
            ? 21
            : 25,
        backgroundColor: 'transparent'
    },
    text : {
        fontSize: 15
    },

});
