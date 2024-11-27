import React, { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Context";
import { Oval } from "react-loader-spinner";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";


export default function Register() {
  // const userCredential = useContext(Context)

  const [userDetails, setUserDetails] = React.useState({
    name: "",
    user: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [registerSeccess, setRegisterSuccess] = React.useState(false);
  const [userVerify, setUserVerify] = React.useState({valid: true, text: "", loading: false})
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (userDetails.password !== userDetails.confirm_password) {
      setError("Password mismatch! Please enter your password correctly");
      return;
    }

    setLoading(true);

    const fetchData = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: userDetails.name,
        userName: userDetails.user,
        email: userDetails.email,
        password: userDetails.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(fetchData.status === 400) {
      const err = await fetchData.json();
      setError(err)
      setLoading(false)
      return
    }
    if (!fetchData.ok) {
      const err = await fetchData.json();
      console.log(err)
      setError("something went wrong");
      return;
    }
    const data = await fetchData.json();
    setLoading(false);
    setError("");
    setRegisterSuccess(true);
  }

  function handleChange(e) {
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  

  async function verifyUsername(e) {

    if(e.target.value === "" || e.target.value.length <= 3) {
      setUserVerify({valid: false, text: "", loading: false})
      return
    }

    const pattern = new RegExp(e.target.pattern)
    if(!pattern.test(e.target.value)) {
      setUserVerify({valid: false, text: "Invalid username!", loading: false})
      return
    }

    try{
      const fetchData = await fetch("/api/auth/username-check/?username="+e.target.value)
      if(fetchData.status === 400) {
        const res = await fetchData.json();
        setUserVerify({valid: false, text: res, loading: false})
        return
      }
      const res = await fetchData.json();
      setUserVerify({valid: true, text: res, loading: false})
    }catch(err){
      console.log(err)
    }
  }

  const debouncedVerify = 
    debounce((e) => {
      verifyUsername(e)
    }, 1000)
  

  function debounce(cb, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      setUserVerify(prev => ({...prev, loading:true}))
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

  if (registerSeccess) {
    return (
      <div className="h-screen flex p-5 flex-col items-center justify-center">
        <div className="flex items-center gap-5">
          <FaCircleCheck className="text-teal w-12 h-12" />
          <div>
            <h1 className="text-2xl text-black font-bold align-center">
              Verification email sent successfully!
            </h1>
            <p className="text-base text-gray-600 mt-1">
              We sent you a verification link on your email id.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-5 flex flex-col items-center justify-center">
      <div className="mb-5 w-full lg:w-1/3">
        <h1 className="text-xl font-semibold">Create your account</h1>
      </div>
      <form
        className="p-5 rounded-md border w-full lg:w-1/3 flex flex-col gap-4 border-gray-200 bg-white"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-base font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={userDetails.name}
            pattern="^[a-zA-Z]+( [a-zA-Z]+)?$"
            title="Name can only contain letters and at most one space between first and last name."
            onChange={(e) => handleChange(e)}
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user" className="text-base font-medium">
            Username
          </label>
          <input
            name="user"
            type="text"
            id="user"
            placeholder="Enter your Username"
            onChange={(e) => {
              handleChange(e)
              debouncedVerify(e)
            }}
            pattern="^(?=([^_]*_?[^_]*){0,2}$)[A-Za-z0-9_]+$"
            title="username should only contain letters, numbers, underscores."
            maxLength={12}
            minLength={4}
            value={userDetails.user}
            autoComplete="off"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
          {userDetails.user.length >= 4 && (
            <div className="flex gap-1 items-center">
              {userVerify.loading ? <Oval color="teal" width="20" height="20" strokeWidth="4" />
              :
              <>
              {userVerify.valid ? <FaCircleCheck className="text-teal w-4 h-4" /> : <FaCircleXmark className="text-red-700 w-4 h-4" />}
              <p className={`text-base font-semibold ${userVerify.valid ? "text-teal" : "text-red-700"}`}>
              {userVerify.text}
              </p>
              </>
            }
            </div>
            )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-base font-medium">
            Email
          </label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Enter your Email"
            onChange={(e) => handleChange(e)}
            value={userDetails.email}
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-base font-medium">
            Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            title="Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
            placeholder="Enter your Password"
            onChange={(e) => handleChange(e)}
            value={userDetails.password}
            autoComplete="off"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm_password" className="text-base font-medium">
            Confirm Password
          </label>
          <input
            name="confirm_password"
            type="password"
            id="confirm_password"
            placeholder="Confirm your Password"
            onChange={(e) => handleChange(e)}
            value={userDetails.confirm_password}
            autoComplete="off"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>
        <p className="text-gray-500 text-base">
          Already have an account?{" "}
          <Link
            className="text-teal font-medium underline hover:text-teal-dark"
            to="/login"
          >
            Login
          </Link>
        </p>
        <div className="flex items-center gap-2.5">
          <button
            className={`self-start bg-teal cursor-pointer hover:bg-teal-dark py-2.5 px-5 rounded-md text-white ${(!userVerify.valid || loading) && "bg-teal/70 cursor-not-allowed hover:bg-teal/70"}`}
            type="submit"
            disabled={!userVerify.valid || loading}
          >
            Register
          </button>
          {loading && (
            <Oval color="teal" width="20" height="20" strokeWidth="4" />
          )}
        </div>
      </form>

      {error && (
        <p className="p-2 mt-2.5 w-full lg:w-1/3 border-l-4 border-red-600 bg-red-600/10 text-red-700 text-base font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
