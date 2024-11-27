import React from "react";
import { Link } from "react-router-dom";

export default function NotFound(){
    return(
        <>
        <div className="px-10">
        <div className="items-center justify-center h-screen flex-col gap-5 flex m-auto max-w-screen-xl">
            <h1 className="text-2xl font-semibold">
            This page does not exist!
            </h1>
            <Link
              to="/"
              className="py-2.5 px-5 rounded-md bg-teal hover:bg-teal-dark text-white text-base"
            >
              Return to home page
            </Link>
          </div>
        </div>
        </>
    )
}