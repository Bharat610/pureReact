import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [error, setError] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false)
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

    console.log(email)

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true)

    try{
        const fetchData = await fetch("/api/auth/reset-link", {
            method: "POST",
            body: JSON.stringify({
                email: email,
            }),
            headers: {
                "Content-Type": "application/json",
              },
        });
        if(!fetchData.ok) {
            const res = await fetchData.json();
            setError(res);
            return
        }
        const res = await fetchData.json();
        setEmailSent(true);
        setLoading(false);
        setError("")

    }catch(err){
        console.log(err)
    }
  }

  if(emailSent) {
    return(
        <div className="h-screen p-5 flex flex-col items-center justify-center">
        <div className="flex items-center gap-5">
          <FaCircleCheck className="text-teal w-12 h-12" />
          <div>
            <h1 className="text-2xl text-black font-bold align-center">
                Password reset email sent successfully!
            </h1>
            <p className="text-base text-gray-600 mt-1">
              We sent you a password reset link on your registered email id.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen p-5 flex flex-col items-center justify-center">
      <div className="mb-5 w-full lg:w-1/3">
        <h1 className="text-xl font-semibold">Forgot your password?</h1>
        <p className="text-base mt-2.5 text-gray-600">
          Enter the email address associated with your account, and we'll send
          you a link to reset your password.
        </p>
      </div>
      <form
        className="p-5 rounded-md border w-full lg:w-1/3 flex flex-col gap-4 border-gray-200 bg-white"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-base font-medium">
            Email
          </label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button
            className={`self-start bg-teal cursor-pointer hover:bg-teal-dark py-2.5 px-5 rounded-md text-white ${
              loading && "bg-teal/70 cursor-not-allowed hover:bg-teal/70"
            }`}
            type="submit"
            disabled={loading}
          >
            Send reset link
          </button>
          {loading && (
            <Oval color="teal" width="20" height="20" strokeWidth="4" />
          )}
        </div>
      </form>
      {/* <Link className="text-base text-teal  font-semibold mt-2.5 w-1/3 hover:text-teal-dark" to="/login">Go back</Link> */}
      {error && (
        <p className="p-2 mt-2.5 w-full lg:w-1/3 border-l-4 border-red-600 bg-red-600/10 text-red-700 text-base font-semibold">
          {error}
        </p>
      )}

    </div>
  );
}
