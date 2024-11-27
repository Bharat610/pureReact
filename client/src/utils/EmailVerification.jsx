import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Context } from "../context/Context";


export default function EmailVerification() {
    const [params, setSearchParams] = useSearchParams();
    const userCredential = useContext(Context)
    const [status, setStatus] = React.useState("")
    // const [text, setText] = React.useState("")

    async function getVerified() {
        const emailVerify = await fetch("/api/auth/verify-email?token=" + params.get("token"));
        console.log(emailVerify)
        if(!emailVerify.ok) {
            const res = await emailVerify.json()
            setStatus(res.message)
            return
        }
        const data = await emailVerify.json();
        userCredential.dispatch({
            type:"LOGIN_SUCCESS",
            payload: data
        })

        window.location.replace("/");
    }
    

    React.useEffect(() => {
        getVerified()
    }, [])

    return(
      <h1 className="text-center text-xl text-black font-bold mt-2.5">{status}</h1>
    )
}