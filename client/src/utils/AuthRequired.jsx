import React, { useContext } from "react";
import { Context } from "../context/Context";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthRequired() {

    const {user} = useContext(Context)

    if(!user){
        return  <Navigate to="/404" replace />
    }

    return <Outlet />
}