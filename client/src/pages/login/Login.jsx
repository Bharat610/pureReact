import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { Oval } from "react-loader-spinner";

export default function Login() {
  const userCredential = useContext(Context);

  const [error, setError] = React.useState("")

  async function handleSubmit(e) {
    e.preventDefault();

    userCredential.dispatch({
      type: "LOGIN_START",
    });

    const loginData = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        userName: e.target.user.value,
        password: e.target.password.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!loginData.ok) {
        userCredential.dispatch({
            type: "LOGIN_FAILED",
          });
        if(loginData.status === 400) {
            const data = await loginData.json();
            setError(data)
            return
        }
        setError("Something went wrong!");
        return
    }

    const data = await loginData.json();
    console.log(data);
    userCredential.dispatch({
      type: "LOGIN_SUCCESS",
      payload: data,
    });
    setError("")
    window.location.replace("/");
  }

  return (
    <div className="h-screen p-5 flex flex-col items-center justify-center">
      <div className="mb-5 w-full lg:w-1/3">
        <h1 className="text-xl font-semibold">Log in to your account</h1>
      </div>
      <form
        className="p-5 rounded-md border w-full lg:w-1/3 flex flex-col gap-4 border-gray-200 bg-white"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user" className="text-base font-medium">
            Username
          </label>
          <input
            type="text"
            name="user"
            id="user"
            placeholder="Enter your Username"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-base font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your Password"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>

        <span className="self-end">
          <Link
            className="text-teal text-base hover:text-teal-dark"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </span>

        <div className="flex items-center gap-2.5">
          <button
            className={`self-start bg-teal cursor-pointer hover:bg-teal-dark py-2.5 px-5 rounded-md text-white ${
              userCredential.isFetching &&
              "bg-teal/70 cursor-not-allowed hover:bg-teal/70"
            }`}
            type="submit"
            disabled={userCredential.isFetching}
          >
            Login
          </button>
          {userCredential.isFetching && (
            <Oval color="teal" width="20" height="20" strokeWidth="4" />
          )}
        </div>
      </form>

      {userCredential.error && (
        <p className="p-2 mt-2.5 w-full lg:w-1/3 border-l-4 border-red-600 bg-red-600/10 text-red-700 text-base font-semibold">
          {error}
        </p>
      )}

      <p className="text-gray-500 mt-2.5 text-base">
        New to the community?{" "}
        <Link
          className="text-teal font-medium underline hover:text-teal-dark"
          to="/register"
        >
          Register
        </Link>
      </p>
    </div>

  );
}
