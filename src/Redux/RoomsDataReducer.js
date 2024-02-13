const initialState = {
    myRooms: [],
    enrolledRooms: [],
    myRoomsLoading: true,
    enrolledRoomsLoading: true,
    breadcrumb: [],
}

const roomsDataReducer = (state = initialState, action) => {
    var newState;
    switch (action.type) {
        case 'RDR_SET_MYROOMS_LOADING':
            newState = {...state};
            newState.myRoomsLoading = true;
            return newState;
        case 'RDR_REMOVE_MYROOMS_LOADING':
            newState = {...state};
            newState.myRoomsLoading = false;
            return newState;

        case 'RDR_SET_ENROLLED_LOADING':
            newState = {...state};
            newState.enrolledRoomsLoading = true;
            return newState;
        case 'RDR_REMOVE_ENROLLED_LOADING':
            newState = {...state};
            newState.enrolledRoomsLoading = false;
            return newState;
        
        case 'RDR_SET_MYROOMS':
            newState = {...state};
            newState.myRooms = action.payload;
            return newState;

        case 'RDR_SET_ENROLLED':
            newState = {...state};
            newState.enrolledRooms = action.payload;
            return newState;

        case 'RDR_SET_BREADCRUMB':
            newState = {...state};
            newState.breadcrumb = action.payload;
            return newState;
        
        default:
            return state;
    }
}

export default roomsDataReducer;