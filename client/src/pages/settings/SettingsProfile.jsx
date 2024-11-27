import React from "react";
import { useOutletContext } from "react-router-dom";
import { Oval } from "react-loader-spinner";

export default function SettingsProfile() {
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

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={(e) => handleUpdate(e)}>
        <div className="flex gap-5 items-center">
          <img
            src={
              updateUser.profilePic
                ? URL.createObjectURL(updateUser.profilePic)
                : user.profilePicture
              // "http://localhost:5000/images/" + user.profilePicture
            }
            alt="Profile Picture"
            className="rounded-full h-20 w-20 object-cover"
          />

          <label
            className="py-1.5 px-2 rounded-md border-2 border-gray-300 cursor-pointer text-base text-gray-600 hover:border-teal/10 hover:bg-teal/10 hover:text-teal"
            htmlFor="fileInput"
          >
            Choose File
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={(e) =>
                setUpdateUser((prev) => ({
                  ...prev,
                  profilePic: e.target.files[0],
                }))
              }
            />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-base font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={updateUser.name}
            onChange={(e) =>
              setUpdateUser((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div>

        {/* <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-base font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={updateUser.username}
            onChange={(e) =>
                setUpdateUser((prev) => ({ ...prev, username: e.target.value }))
              }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div> */}

        {/* <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-base font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={updateUser.email}
            onChange={(e) =>
                setUpdateUser((prev) => ({ ...prev, email: e.target.value }))
              }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div> */}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="about" className="text-base font-medium">
            About
          </label>
          <textarea
            rows="4"
            id="about"
            placeholder="Write a short description about yourself - job, education, skills, experience etc..."
            name="about"
            value={updateUser.about}
            onChange={(e) =>
              setUpdateUser((prev) => ({ ...prev, about: e.target.value }))
            }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="websiteURL" className="text-base font-medium">
            Website Link
          </label>
          <input
            type="url"
            id="websiteURL"
            placeholder="https://yourswebsite.com"
            name="websiteURL"
            value={updateUser.websiteURL}
            onChange={(e) =>
              setUpdateUser((prev) => ({ ...prev, websiteURL: e.target.value }))
            }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="githubURL" className="text-base font-medium">
            GitHub Link
          </label>
          <input
            type="url"
            id="githubURL"
            placeholder="https://yourswebsite.com"
            name="githubURL"
            value={updateUser.githubURL}
            onChange={(e) =>
              setUpdateUser((prev) => ({ ...prev, githubURL: e.target.value }))
            }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="linkedinURL" className="text-base font-medium">
            LinkedIn Link
          </label>
          <input
            type="url"
            id="linkedinURL"
            placeholder="https://yourswebsite.com"
            name="linkedinURL"
            value={updateUser.linkedinURL}
            onChange={(e) =>
              setUpdateUser((prev) => ({
                ...prev,
                linkedinURL: e.target.value,
              }))
            }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="xURL" className="text-base font-medium">
            Twitter Link
          </label>
          <input
            type="url"
            id="xURL"
            placeholder="https://yourswebsite.com"
            name="xURL"
            value={updateUser.xURL}
            onChange={(e) =>
              setUpdateUser((prev) => ({ ...prev, xURL: e.target.value }))
            }
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button
            className={`self-start bg-teal hover:bg-teal-dark py-2.5 px-5 rounded-md text-white ${isFetching &&
              "bg-teal/70 cursor-not-allowed hover:bg-teal/70"
            }`}
            type="submit"
            disabled={isFetching}
          >
            Update
          </button>
          {isFetching && (
            <Oval color="teal" width="20" height="20" strokeWidth="4" />
          )}
        </div>
      </form>

      {userUpdated && (
        <div className="mt-5 p-2.5 bg-teal/30 border-l-4 border-l-teal/80">
          <p className="text-teal text-base font-semibold">
            User data updated successfully!!
          </p>
        </div>
      )}
    </>
  );
}
