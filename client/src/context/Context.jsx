import React from "react";
import {createContext, useReducer} from "react";
import userReducer from "./Reducer";


const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false
}

export const Context = createContext(INITIAL_STATE)

export const ContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, INITIAL_STATE)

    React.useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])

    return(
        <Context.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error:state.error,
            dispatch
        }}>
                {children}
        </Context.Provider>
    )
}

