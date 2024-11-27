import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { Context } from "../context/Context";
import { useParams } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { FaRegThumbsUp } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { FaGlobe } from "react-icons/fa6";
import { FaCakeCandles } from "react-icons/fa6";
import { useHandleReadingList } from "../utils/handleReadingList";
import Footer from "../components/Footer";
// import Posts from "../components/posts/Posts";

export default function UserSingle() {
  const { user } = useContext(Context);
  const params = useParams();
  const [userData, setUserData] = React.useState([]);
  const [userPosts, setUserPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const handleReadingList = useHandleReadingList();

  const [toggleDropdown, setToggleDropdown] = React.useState(null);
  const toggleRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const dialogRef = React.useRef(null);

  const navigate = useNavigate();

  async function fetchUser() {
    try {
      setLoading(true);
      const getUser = await fetch("/api/users/" + params.username);
      if (!getUser.ok) {
        if (getUser.status === 404) {
          return navigate("/404");
        }
      }
      const res = await getUser.json();
      setUserData(res);
      await fetchUserPost();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchUserPost() {
    try {
      const userPosts = await fetch(`/api/posts?userName=${params.username}`);
      if (userPosts.status === 404) {
        setUserPosts([]);
        return;
      }
      const res = await userPosts.json();
      setUserPosts(res);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    fetchUser();
  }, [params.username]);

  const btn_array = [];

  function handleRef(elem) {
    !btn_array.includes(elem) && btn_array.push(elem);
  }

  function getMap() {
    if (!menuRef.current) {
      menuRef.current = new Map();
    }
    return menuRef.current;
  }

  function handleEdits(id) {
    if (toggleDropdown) {
      setToggleDropdown(null);
    } else {
      setToggleDropdown(id);
    }
  }

  function clicker(e) {
    const map = getMap();
    if (
      !map.get(toggleDropdown).contains(e.target) &&
      btn_array.every((elem) => !elem.contains(e.target))
    ) {
      setToggleDropdown(null);
    }
  }

  React.useEffect(() => {
    if (toggleDropdown) {
      console.log("on it");
      document.body.addEventListener("click", clicker);
    }
    return () => {
      console.log("something something");
      document.body.removeEventListener("click", clicker);
    };
  }, [toggleDropdown]);

  //dialog box toggle
  function handleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  //Delete Post
  async function handlePostDelete(id) {
    try {
      const deletePost = await fetch("/api/posts/" + id, {
        method: "DELETE",
        body: JSON.stringify({
          userName: user.userName,
        }),
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!deletePost.ok) {
        alert(deletePost.statusText);
        return;
      }
      const res = await deletePost.json();
      handleDialog();
      alert("Post deleted successfully!");
      fetchUserPost();
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <TopBar />
      <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 max-w-screen-desktop m-auto gap-8 flex flex-col items-start lg:flex-row">
          <div className="p-5 rounded-md bg-white w-full lg:w-1/4 flex flex-col gap-5 border-2 border-gray-200">
            <div className="flex flex-col gap-2.5">
              <img
                // src={"http://localhost:5000/images/" + userData.profilePicture}
                src={userData.profilePicture}
                className="rounded-full object-cover h-28 w-28"
                alt="user Profile Picture"
              />
              <div className="flex gap-0.5 flex-col">
                <h1 className="text-2xl font-semibold">{userData.name}</h1>
                <h3 className="text-base text-gray-600">
                  @{userData.userName}
                </h3>
              </div>
            </div>

            {userData.about && (
              <div className="border-y-2 border-gray-200 py-5">
                <p className="text-base text-gray-600">{userData.about}</p>
              </div>
            )}

            <div>
              <ul className="flex flex-col gap-5">
                <li className="flex gap-2 items-center">
                  <FaCakeCandles className="inline-block w-5 h-5" />
                  <span className="text-base text-gray-600">
                    Joined on{" "}
                    {new Date(userData.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </li>

                {userData.websiteURL && (
                  <li className="flex gap-2 items-center">
                    <FaGlobe className="inline-block w-5 h-5" />
                    <Link
                      to={userData.websiteURL}
                      className="text-base text-gray-600 hover:text-teal"
                    >
                      {userData.websiteURL}
                    </Link>
                  </li>
                )}

                {userData.githubURL && (
                  <li className="flex gap-2 items-center">
                    <FaGithub className="inline-block w-5 h-5" />
                    <Link
                      to={userData.githubURL}
                      className="text-base text-gray-600 hover:text-teal"
                    >
                      {new URL(userData.githubURL).pathname.split("/")}
                    </Link>
                  </li>
                )}

                {userData.linkedinURL && (
                  <li className="flex gap-2 items-center">
                    <FaLinkedin className="inline-block w-5 h-5" />
                    <Link
                      to={userData.linkedinURL}
                      className="text-base text-gray-600 hover:text-teal"
                    >
                      {
                        new URL(`${userData.linkedinURL}`).pathname.split(
                          "/"
                        )[2]
                      }
                    </Link>
                  </li>
                )}

                {userData.xURL && (
                  <li className="flex gap-2 items-center">
                    <FaSquareXTwitter className="inline-block w-5 h-5" />
                    <Link
                      to={userData.xURL}
                      className="text-base text-gray-600 hover:text-teal"
                    >
                      {new URL(userData.xURL).pathname.split("/")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full lg:w-3/4">
          <h2 className="text-2xl mb-2.5 text-black font-semibold">Posts from <span className="text-teal">{userData.userName}</span></h2>
            {loading && (
              <p className="text-base font-semi-bold text-gray-600">
                Loading...
              </p>
            )}
            {!loading && userPosts.length === 0 ? (
              <>
                {user?._id === userData._id ? (
                  <p className="text-base p-5 bg-teal/10 text-gray-600">
                    You haven't created any post yet.{" "}
                    <Link
                      to="/write"
                      className="underline text-teal font-semibold hover:no-underline"
                    >
                      Create post
                    </Link>
                  </p>
                ) : (
                  <p className="text-base p-5 bg-teal/10 text-gray-600">
                    {userData.userName + " is yet to write a post"}
                  </p>
                )}
              </>
            ) : (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex bg-white border-2 border-gray-200 rounded-md items-center p-5 gap-5"
                >
                  {/* {post.photo && (
                    <Link to={`/post/${post._id}`}>
                      <img
                        src={"http://localhost:5000/images/" + post.photo}
                        className="w-48 h-32 rounded-md object-cover"
                        alt={post.title}
                      />
                    </Link>
                  )} */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          "http://localhost:5000/images/" +
                          post.userDetails.userPhoto
                        }
                        alt=""
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700 font-medium">
                          {post.userDetails.userName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleString("default", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>

                      <div className="relative self-start ml-auto">
                        {user && (
                          <>
                            {user._id === userData._id ? (
                              <button
                                ref={(toggleRef) => handleRef(toggleRef)}
                                onClick={() => handleEdits(post._id)}
                                className="cursor-pointer p-2 rounded-md hover:bg-teal/10"
                              >
                                <BsThreeDots className="w-6 h-6" />
                              </button>
                            ) : (
                              <div
                                className="p-2 rounded cursor-pointer hover:bg-teal/10"
                                onClick={() =>
                                  handleReadingList(
                                    user?.readingList.includes(post._id),
                                    post._id
                                  )
                                }
                              >
                                {user?.readingList.includes(post._id) ? (
                                  <FaBookmark className="w-5 h-5" />
                                ) : (
                                  <FaRegBookmark className="w-5 h-5" />
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {toggleDropdown === post._id && (
                          <>
                            <div
                              ref={(node) => {
                                const map = getMap();
                                if (node) {
                                  map.set(post._id, node);
                                } else {
                                  map.delete(post);
                                }
                              }}
                              className={`absolute min-w-32 w-max right-0 top-full mt-1 bg-white p-1 rounded-md border border-gray-300`}
                            >
                              <ul className="flex flex-col gap-1">
                                <li>
                                  <Link
                                    to="/write"
                                    state={post}
                                    className="block py-1 px-2 rounded-md text-base text-gray-700 hover:bg-teal/10 hover:text-teal"
                                  >
                                    Edit
                                  </Link>
                                </li>
                                <li className="border-t pt-1 border-t-gray-300">
                                  <span
                                    onClick={handleDialog}
                                    className="block py-1 px-2 rounded-md cursor-pointer text-base text-red-600 hover:bg-red-600/10 hover:text-red-600"
                                  >
                                    Delete
                                  </span>
                                </li>
                              </ul>
                            </div>

                            <dialog ref={dialogRef}>
                              <div className="flex p-10 flex-col items-center gap-2.5">
                                <h3 className="text-2xl text-black font-semibold">
                                  Are you sure you want to delete this Post?
                                </h3>
                                <p className="text-base font-semibold text-gray-600">
                                  All the post data will be deleted. This action
                                  cannot be undone.
                                </p>
                                <div className="flex gap-2.5 mt-5">
                                  <button
                                    onClick={() => handlePostDelete(post._id)}
                                    className="py-2.5 px-5 rounded-md border-2 border-transparent bg-black text-white rounded-md text-base"
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
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl lg:text-2xl font-semibold hover:text-teal-dark">
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </h3>
                    <div className="flex flex-wrap gap-x-2 gap-y-px">
                      {post.categories.map((category, index) => (
                        <Link
                          to={"/category/?name=" + category}
                          key={index + 1}
                          className="text-sm text-gray-600 p-1 cursor-pointer rounded border border-transparent hover:bg-gray-200 hover:border-gray-300"
                        >
                          #{category}
                        </Link>
                      ))}
                    </div>
                    <Link to={"/post/" + post._id} className="flex">
                      <div className="flex gap-5 p-1 rounded border border-transparent hover:bg-gray-100 hover:border-gray-200">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FaRegThumbsUp className="w-4 h-4 text-black" />{" "}
                          <span>
                            {post.likesCount}{" "}
                            {post.likesCount === 1 ? "Like" : "Likes"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FaRegComment className="w-4 h-4 text-black" />{" "}
                          <span>{post.comments.length} Comments</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
