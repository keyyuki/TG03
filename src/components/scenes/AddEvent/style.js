const React = require('react-native');

const {StyleSheet, Platform, Dimensions} = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

module.exports = StyleSheet.create({
    main: {
        flex:1,
        backgroundColor: '#f9fafa'
    },

    content: {
        height: deviceHeight - 135,
        maxHeight: deviceHeight - 135,
        overflow:'hidden'
    },
    contentInput: {
        fontSize:18,
        marginHorizontal: 3,
        textAlignVertical: 'top',
        maxHeight: deviceHeight - 235,
    },
    overlay:{
        position:'absolute',
        width: deviceWidth,
        height:deviceHeight,
        backgroundColor:'transparent',
        right: 0,
        bottom: 0,
    },
    additionalItem:{
        backgroundColor: '#b0bec5',
        borderColor: 'gray',
        borderRadius: 5,
        padding: 5,
        marginVertical:5
    },
    PickDateTimeBox_Main: {
        flexDirection :'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex:1,
        backgroundColor: '#f9fafa'
    },
    PickDateTimeBox_Content: {
        flex:1,
        alignItems: 'center'
    },
    PickDateTimeBox_Row:{
        alignItems: 'center',
        marginVertical:10
    },
    calendarBox_main: {
        flexDirection :'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex:1,
        backgroundColor: '#f9fafa'
    },
    calendarBox_content:{
         flex:1,
        alignItems: 'center'
    },
    calendarBox_row:{
        flexDirection:'row',
        width: 250,
        alignSelf: 'center',
        paddingVertical: 5,
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    calendarBox_formLabel:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    calendarBox_formInput: {
        flex: 2
    },
    modalOutLine: {
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        zIndex:1,
        
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        marginHorizontal:10,
        borderRadius: 10,
        alignItems: 'flex-start',
        zIndex:2, 
        
    },
    roundDatePicker: {
        width: 42,
        height: 42,
        borderRadius: 24,
        borderWidth:0.5,
        borderColor:"dodgerblue",
        backgroundColor:"white",
        alignItems: 'center',
        justifyContent: 'center',
        margin:8,
       
    },

    roundDatePickerActive:{
        width: 42,
        height: 42,
        borderRadius: 24,
        borderWidth:0.5,
        borderColor:"dodgerblue",
        backgroundColor:"dodgerblue",
        alignItems: 'center',
        justifyContent: 'center',
        margin:8,
    },
    divider: {
       marginVertical: 5,
       marginHorizontal: 2,
       borderBottomWidth: 0.5,
       borderColor: '#ccc'
     },
})
