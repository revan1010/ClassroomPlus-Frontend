const initialState = {
    isLogged: false,
}

const authReducer = (state = initialState, action) => {
    var newState;
    switch (action.type) {
        case 'AR_SET_LOGGED':
            newState = {...action.payload};
            newState.isLogged = true;
            return newState;
        
        case 'AR_LOGOUT':
            newState = {};
            newState.isLogged = false;
            return newState;
        
        default:
            return state;
    }
}

export default authReducer;