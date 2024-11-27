import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { useContext } from "react";
import { Context } from "../../context/Context";
import Footer from "../../components/Footer";


export default function SettingsLayout() {

  const { user, isFetching, error, dispatch } = useContext(Context);

  const [updateUser, setUpdateUser] = React.useState({
    name: user.name,
    // username: user.userName,
    // email: user.email,
    profilePic: "",
    about: user.about,
    websiteURL: user.websiteURL,
    githubURL: user.githubURL,
    linkedinURL: user.linkedinURL,
    xURL: user.xURL
  });

  const [userUpdated, setUserUpdated] = React.useState(false);

  async function getImage() {
    const formData = new FormData();
    // const filename = Date.now() + updateUser.profilePic.name;
    // formData.append("name", filename);
    formData.append("file", updateUser.profilePic);

    try {
      const imageData = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!imageData.ok) {
        console.log(imageData.statusText);
        return;
      }
      const res = await imageData.json();
      return res.url;
    } catch (err) {
      console.log(err);
    }
    // console.log(filename);
    // return filename;
  }

  async function handleUpdate(e) {
    e.preventDefault();
    dispatch({
      type: "UPDATE_START",
      payload: user,
    });
    try {
      const updater = await fetch("/api/users/" + user._id, {
        method: "PUT",
        body: JSON.stringify({
          userId: user._id,
          name: updateUser.name,
          // userName: updateUser.username,
          // email: updateUser.email,
          // password: updateUser.password,
          profilePicture: updateUser.profilePic ? (await getImage()) : undefined,
          about: updateUser.about,
          websiteURL: updateUser.websiteURL,
          githubURL: updateUser.githubURL,
          linkedinURL: updateUser.linkedinURL,
          xURL: updateUser.xURL

        }),
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!updater.ok) {
        alert("Failed to update user data: " + updater.statusText);
        throw new Error("Failed to update data");
      }
      const res = await updater.json();
      console.log(res);
      setUserUpdated(true);
      dispatch({
        type: "UPDATE_SUCCESS",
        payload: res,
      });
    } catch (err) {
      console.log(err);
    }
  }

    return(
        <>
        <TopBar />
        <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 max-w-screen-xl m-auto flex flex-col lg:flex-row items-start gap-5 lg:gap-10">
          <div className="w-full lg:w-1/4 p-5 bg-white flex flex-col gap-1 border-2 rounded-md border-gray-200">
            <NavLink to="." end style={({ isActive }) => isActive ? {backgroundColor: 'rgba(0,128,128,0.1)', color: 'teal'} : null} className="p-2 rounded-md text-base text-gray-600">Profile</NavLink>
            <NavLink to="account" style={({ isActive }) => isActive ? {backgroundColor: 'rgba(0,128,128,0.1)', color: 'teal'} : null} className="p-2 rounded-md text-base text-gray-600">Account</NavLink>
          </div>
          <div className="w-full lg:w-3/4 p-5 lg:p-10 bg-white border-2 rounded-md border-gray-200">
                <Outlet context={[user, isFetching, error, dispatch, updateUser, setUpdateUser, handleUpdate, userUpdated, setUserUpdated]} />
          </div>
        </div>
      </div>
      <Footer />
      </>
    )
}