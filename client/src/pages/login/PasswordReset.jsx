import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Oval } from "react-loader-spinner";

export default function PasswordReset() {
  const [params, setSearchParams] = useSearchParams();
  const [error, setError] = React.useState("");
  const [updatedPassword, setUpdatedPassword] = React.useState(false);
  const [password, setPassword] = React.useState({
    password: "",
    newPassword: "",
  });

  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    if (password.password !== password.newPassword) {
        setError("Password mismatch!");
      setLoading(false);
      return
    }

    const passwordReset = await fetch(
      "/api/auth/password-reset?token=" + params.get("token"),
      {
        method: "PUT",
        body: JSON.stringify({
          password: password.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!passwordReset.ok) {
      const res = await passwordReset.json();
      setError(res.message);
      return;
    }

    const data = await passwordReset.json();
    setLoading(false);
    setUpdatedPassword(true);
    setError("");
  }

  if (updatedPassword) {
    return (
      <div className="h-screen p-5 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
            <h1 className="text-2xl text-black font-bold align-center">
              Password updated successfully!
            </h1>
            <p className="text-base text-gray-600 mt-1">
              Please login with your new password
            </p>
            <Link
              className="bg-teal cursor-pointer hover:bg-teal-dark py-2.5 px-5 rounded-md text-white"
              to="/login"
            >
              Login
            </Link>
          </div>
      </div>
    );
  }

  return (
    //   <h1 className="text-center text-xl text-black font-bold mt-2.5">{status}</h1>F
    <div className="h-screen p-5 flex flex-col items-center justify-center">
      <div className="mb-5 w-full lg:w-1/3">
        <h1 className="text-xl font-semibold">Change your password</h1>
      </div>
      <form
        className="p-5 rounded-md border w-full lg:w-1/3 flex flex-col gap-4 border-gray-200 bg-white"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-base font-medium">
            New password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            title="Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
            placeholder="Enter your Password"
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, password: e.target.value }))
            }
            value={password.password}
            // autoComplete="true"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm_password" className="text-base font-medium">
            Confirm new password
          </label>
          <input
            name="confirm_password"
            type="password"
            id="confirm_password"
            placeholder="Confirm your Password"
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
            }
            value={password.newPassword}
            // autoComplete="true"
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
            Reset Password
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
