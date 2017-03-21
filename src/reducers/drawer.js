let initialState = {
    isOpen: false
}
const drawer = (state =initialState, action) => {
    switch (action.type) {
        case 'CLOSE_DRAWER':
            return Object.assign({}, state, {
                isOpen: false
            });
        case 'OPEN_DRAWER':
            
            return Object.assign({}, state, {
                isOpen: true
            })
        default:
            return state;
    }
}
export default drawer;
