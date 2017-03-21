import React, {Component} from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import {StyleSheet, View, Modal} from 'react-native'
import {Spinner} from 'native-base'
import thunk from 'redux-thunk';
import tgReducerApp from './reducers'
import Navigation from './components/Navigation';
import ContactModel from './model/ContactModel'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal1: {
    height: 300,
  },
});

class App extends Component {

    constructor() {
      super();
      this.state = {
        store: createStore(tgReducerApp, applyMiddleware(thunk)),
        showLoadingModal: true
      };
    }

    componentDidMount(){
      ContactModel.sync();
      this.setState({showLoadingModal: false})
    }

    render() {
      if (this.state.showLoadingModal) {
          return (
            <Provider store={this.state.store} >
              <View style={{backgroundColor: 'white'}}>
                  <View style={styles.container}>
                    <Modal
                      style={[styles.modal, styles.modal1]}
                      backdrop={false}
                      ref={(c) => { this._modal = c; }}
                      swipeToClose={false}
                      onRequestClose={() => {}}
                    >
                    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: 20 }}>
                        <Spinner color="green" />
                    </View>
                    </Modal>
                  </View>
              </View>
              </Provider>
          )
      }
      return (
        <Provider store={this.state.store} >
          <Navigation />
        </Provider>
      );
    }
}

export default App;
