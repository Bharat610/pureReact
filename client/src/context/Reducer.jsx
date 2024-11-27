

export default function userReducer(state, action) {
    switch(action.type){
        case "LOGIN_START" : {
            return{
                user: null,
                isFetching: true,
                error: false
            }
        }
        case "LOGIN_SUCCESS" : {
            return{
                user: action.payload,
                isFetching: false,
                error: false
            }
        }
        case "LOGIN_FAILED" : {
            return{
                user: null,
                isFetching: false,
                error: true
            }
        }
        case "LOGOUT" : {
            return{
                user:null,
                isFetching: false,
                error: false
            }
        }
        case "UPDATE_START" : {
            return{
                ...state,
                isFetching: true,
                error: false

            }
        }
        case "UPDATE_SUCCESS" : {
            return{
                user: action.payload,
                isFetching: false,
                error: false

            }
        }
        case "UPDATE_FAILED" : {
            return{
                ...state,
                isFetching: false,
                error: true
            }
        }
        case "USER_DELETE" : {
            return{
                user: null,
                isFetching: false,
                error: false
            }
        }
        default : {
            throw Error('Unknown action: ' + action.type);
        }
    }
}