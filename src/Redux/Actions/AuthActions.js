export const loginUser = details => {
    return {
        type: "AR_SET_LOGGED",
        payload: details,
    };
};

export const logoutUser = () => {
    localStorage.removeItem("JWTtoken");
    return {
        type: "AR_LOGOUT",
    };
};
