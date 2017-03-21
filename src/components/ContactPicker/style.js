const React = require('react-native');

const { StyleSheet } = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1, 
    alignSelf: 'stretch', 
    
    backgroundColor:'#fcfcfc'
  },
  tagContainer: {
    flexDirection:"row", 
    flexWrap:"wrap"
  },
  tag: {
    backgroundColor:'#ccc', 
    alignSelf:"stretch",
    paddingHorizontal:5, 
    paddingVertical:3,
    justifyContent:'space-around',
    marginRight:5,
    marginVertical: 3,
    borderWidth: 1,
    borderColor:'#636262',
    borderRadius: 5,
    flexDirection:"row"
  },
  tagDeleting: {
    borderColor:'red',
  }
});