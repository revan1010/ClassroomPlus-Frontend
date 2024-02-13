export const setMyRoomsLoading = () => {
    return {
        type: "RDR_SET_MYROOMS_LOADING"
    };
};

export const removeMyRoomsLoading = () => {
    return {
        type: "RDR_REMOVE_MYROOMS_LOADING"
    };
};

export const setMyRooms = (data) => {
    return {
        type: "RDR_SET_MYROOMS",
        payload: data
    };
};



export const setEnrolledLoading = () => {
    return {
        type: "RDR_SET_ENROLLED_LOADING"
    };
};

export const removeEnrolledLoading = () => {
    return {
        type: "RDR_REMOVE_ENROLLED_LOADING"
    };
};

export const setEnrolled = (data) => {
    return {
        type: "RDR_SET_ENROLLED",
        payload: data
    };
};


export const setBreadcrumb = (data) => {
    return {
        type: "RDR_SET_BREADCRUMB",
        payload: data
    };
};
