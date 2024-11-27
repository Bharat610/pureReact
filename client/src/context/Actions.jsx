
export function loginStart(userCredential) {
    dispatch({
        type: "LOGIN_START"
    })
}

export function loginSuccess(user) {
    dispatch({
        type: "LOGIN_SUCCESS",
        payload: user
    })
}

export function loginFailed() {
    dispatch({
        type: "LOGIN_FAILED"
    })
}