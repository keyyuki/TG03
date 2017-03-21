import { combineReducers } from 'redux'
import event from './event';
import drawer from './drawer';
import navigation from './navigation'
import eventList from './eventList'
import report from './report'

const tgReducerApp = combineReducers({
  event,
  drawer,
  eventList,
  navigation,
  report
})

export default tgReducerApp

