import { NavigationExperimental } from 'react-native';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

const initialState = {
    index: 0,
    // @TODO : tam lam trang add truoc. routes: [{key:'day-by-day-list'}]
    routes: [{key:'list-event-daily'}]
    //routes: [{key:'report-contact-daterange-detail'}]

}
const navigation = (state = initialState, action) => {
    switch (action.type) {
        case 'NAV_CHANGE':
            var navState =  state;
            if(action.changeType == 'push'){
                // xử lí TH route đã tồn tại. Loại bỏ route khỏi stack rồi add 1 route mới vào
                var index = navState.routes.findIndex((i) => {return i.key == action.route.key})
                if(index > -1){
                    const clonedState = Object.assign({}, state);
                    clonedState.routes.splice(index, 1);
                    return NavigationStateUtils.push(clonedState, action.route);
                }

                navState = NavigationStateUtils.push(navState, action.route)
            }
            if(action.changeType == 'pop'){
                navState = NavigationStateUtils.pop(navState)
            }
            if(navState != state){
                return navState;
            }
            return state;
        default:
            return state;
    }
}
export default navigation;
