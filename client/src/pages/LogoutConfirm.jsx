import React, { useContext } from "react";
import { Context } from "../context/Context";
import TopBar from "../components/TopBar";
import { Navigate, useNavigate } from "react-router-dom";

export default function LogoutConfirm() {
  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate()

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    return navigate("/")
  }

  if(!user){
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <TopBar />
      <div className="px-10">
        {user && (
          <div className="items-center justify-center min-h-[700px] flex-col gap-5 flex m-auto max-w-screen-xl">
            <h1 className="text-2xl text-center font-semibold">
              Are you sure you want to Logout?
            </h1>
            <button
              onClick={handleLogout}
              className="py-2.5 px-5 rounded-md bg-teal hover:bg-teal-dark text-white text-base"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
