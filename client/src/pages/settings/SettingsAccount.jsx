import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function SettingsAccount() {
  const [
    user,
    isFetching,
    error,
    dispatch,
    updateUser,
    setUpdateUser,
    handleUpdate,
    userUpdated,
    setUserUpdated,
  ] = useOutletContext();

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const [updateError, setUpdateError] = React.useState(false);

  const dialogRef = React.useRef(null)
  const navigate = useNavigate();

  async function handlePasswordChange(e) {
    e.preventDefault();
    dispatch({
      type: "UPDATE_START",
    });
    try {
      const updatePassword = await fetch("/api/users/" + user._id, {
        method: "PUT",
        body: JSON.stringify({
          userId: user._id,
          currentPassword: oldPassword,
          newPassword: newPassword,
        }),
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!updatePassword.ok) {
        dispatch({
          type: "UPDATE_FAILED",
        });
        setUpdateError(true);
        return;
      }
      const res = await updatePassword.json();
      console.log(res);
      dispatch({
        type: "UPDATE_SUCCESS",
        payload: res,
      });
      setUpdateSuccess(true);
    } catch (err) {
      console.log(err);
    }
  }

  //user delete fialog box
  function handleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  //Delete user
  async function handleUserDelete() {
    try{
      const deleteUser = await fetch("/api/users/"+user._id, {
        method: "DELETE",
        body: JSON.stringify({userId: user._id}),
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        }
      });
      if(!deleteUser.ok){
        console.log(deleteUser.statusText)
        return
      }
      localStorage.removeItem('user')
      dispatch({
        type: "USER_DELETE",
      });
      navigate("/", {replace: true});
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => handlePasswordChange(e)}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="oldPassword" className="text-base font-medium">
            Current Password
          </label>
          <input
            name="oldPassword"
            type="password"
            id="oldPassword"
            placeholder="Enter your current password"
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
            autoComplete="true"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="newPassword" className="text-base font-medium">
            New Password
          </label>
          <input
            name="newPassword"
            type="password"
            id="newPassword"
            placeholder="Enter your new password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            autoComplete="true"
            className="w-full p-2 rounded-md border border-gray-300"
            required
          />
        </div>

        <button
          className="self-start bg-teal hover:bg-teal-dark py-2.5 px-5 rounded-md text-white text-base"
          type="submit"
        >
          Update
        </button>
      </form>

      {/* update success message */}
      {updateSuccess && (
        <div className="mt-5 p-2.5 bg-teal/30 border-l-4 border-l-teal/80">
          <p className="text-teal text-base font-semibold">
            Password updated successfully!!
          </p>
        </div>
      )}
      {/* update failed message */}
      {updateError && (
        <div className="mt-5 p-2.5 bg-red-500/30 border-l-4 border-l-red-500/80">
          <p className="text-red-600 text-base font-semibold">
            Incorrect password! Enter your password correctly.
          </p>
        </div>
      )}

      <div className="mt-5 pt-5 flex flex-col gap-5 border-t border-t-gray-300">
        <h3 className="text-red-600 font-medium text-2xl">Danger Zone</h3>
        <p className="text-gray-600">
          <b>Delete your account:</b> This will delete all your data including
          all of your posts. This action cannot be undone.
        </p>
        <button
          onClick={handleDialog}
          className="self-start bg-red-600 hover:bg-red-700 py-2.5 px-5 rounded-md text-white text-base"
        >
          Delete Account
        </button>
      </div>
      <dialog ref={dialogRef}>
        <div className="flex w-[700px] p-10 flex-col items-center gap-10">
          <h3 className="text-2xl text-black font-semibold text-center">
            This action cannot be undone. Are you sure you want to delete your account?
          </h3>
          <div className="flex gap-2.5">
            <button
              onClick={handleUserDelete}
              className="py-2.5 px-5 rounded-md border-2 border-transparent bg-red-600 hover:bg-red-700 text-white rounded-md text-base"
            >
              Delete
            </button>
            <button
              onClick={handleDialog}
              className="py-2.5 px-5 border-2 border-black hover:bg-black hover:text-white rounded-md text-black rounded-md text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
