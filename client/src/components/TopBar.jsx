import React, { useCallback, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaBars } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import Sidebar from "./Sidebar";

export default function TopBar() {
  const { user, dispatch } = useContext(Context);
  const [toggleDropdown, setToggleDropdown] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [postQuery, setPostQuery] = React.useState([]);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [toggleMobileIcon, setToggleMobileIcon] = React.useState(false);
  const [categoryBtnToggle, setCategoryBtnToggle] = React.useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const resultRef = useRef(null);
  const userToggle = useRef(null);
  const userDropdown = useRef(null);
  const mobileIcon = useRef(null);
  const mobileIconBox = useRef(null);

  // function handleDropdown() {
  //   setToggleDropdown((prev) => !prev);
  // }

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  async function searchResults(query) {
    try {
      if (query === "") {
        setPostQuery([]);
        return;
      }
      const fetchResults = await fetch("https://purereact-api.onrender.com/api/posts/?search=" + query);
      if (fetchResults.status === 404) {
        setPostQuery([]);
        return;
      }

      const res = await fetchResults.json();
      setPostQuery(res);
    } catch (err) {
      console.log(err);
    }
  }

  const debouncedSearch = useCallback(debounce(searchResults, 500), []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate("/search/?q=" + search, { replace: true });
  }

  function handleSearchChange(e) {
    setSearchVisible(true);
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  }

  //searchbar outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        resultRef.current &&
        !resultRef.current.contains(e.target)
      ) {
        setSearchVisible(false);
      }
    };
    if (searchVisible) {
      document.body.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [searchVisible]);

  //user icon toggle - outside click
  React.useEffect(() => {
    if (toggleDropdown) {
      document.body.addEventListener("click", handleUserToggle);
    }
    function handleUserToggle(e) {
      if (
        userToggle.current &&
        !userToggle.current.contains(e.target) &&
        userDropdown.current &&
        !userDropdown.current.contains(e.target)
      ) {
        setToggleDropdown(false);
      }
    }

    return () => {
      document.body.removeEventListener("click", handleUserToggle);
    };
  }, [toggleDropdown]);


  //mobile login icon - outside click
  React.useEffect(() => {
    if (toggleMobileIcon) {
      document.body.addEventListener("click", handleClicker);
    }
    function handleClicker(e) {
      if (
        mobileIcon.current &&
        !mobileIcon.current.contains(e.target) &&
        mobileIconBox.current &&
        !mobileIconBox.current.contains(e.target)
      ) {
        setToggleMobileIcon(false);
      }
    }

    return () => {
      document.body.removeEventListener("click", handleClicker);
    };
  }, [toggleMobileIcon]);

  return (
    <header className="bg-white px-5 lg:px-10">
      <div className="relative z-1 items-center justify-between flex gap-2 m-auto py-2.5 max-w-screen-desktop">
        {/* mobile category toggle bar */}
        <div className="lg:hidden flex items-center">
          <button
            className="lg:hidden"
            onClick={() => setCategoryBtnToggle((prev) => !prev)}
          >
            <FaBars className="w-7 h-7" />
          </button>

          {/* category container toggable */}
          {categoryBtnToggle && (
            <div className="h-screen fixed left-0 top-0 shadow-[100px_2px_2px_5px_rgba(0,0,0,0.3)] p-5 bg-white z-30 w-3/4">
              <div className="flex justify-between items-center ml-2.5 mb-2.5">
                <h3 className="font-medium text-lg text-black">Categories</h3>{" "}
                <button onClick={() => setCategoryBtnToggle(false)}>
                  <FaXmark className="w-7 h-7" />
                </button>
              </div>
              <Sidebar onClick={() => setCategoryBtnToggle(false)} />
            </div>
          )}
        </div>

        <form
          className="flex items-center w-4/5 lg:w-3/5"
          onSubmit={(e) => handleSearchSubmit(e)}
        >
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dmcksyahd/image/upload/v1732798027/pureReact_c3udvm.png"
              className="w-20"
              alt="PureReact logo"
            />
          </Link>
          <div
            ref={searchRef}
            className="relative flex items-center w-full relative ml-2"
          >
            <button
              className="hidden lg:block absolute left-0 px-2"
              type={searchVisible ? "submit" : "button"}
            >
              <FaMagnifyingGlass className="w-6 h-6" />
            </button>

            {/* mobile search icon button */}
            <button
              type="button"
              className="lg:hidden absolute px-2 right-0"
              onClick={() => {
                if (window.screen.width <= 1024) {
                  setSearchVisible((prev) => !prev);
                }
              }}
            >
              <FaMagnifyingGlass className="w-6 h-6" />
            </button>
            <input
              id="search-input"
              type="text"
              className={`border ${
                !searchVisible && "hidden"
              } lg:block border-gray-400 rounded w-full py-1 lg:py-2 pl-2 lg:pl-11 pr-9 lg:pr-2.5`}
              placeholder="Search..."
              name="search"
              onChange={handleSearchChange}
              value={search}
              autoComplete="off"
            />

            {postQuery.length !== 0 && searchVisible && (
              <div
                ref={resultRef}
                className="absolute lg:left-0 lg:right-0 mt-1 top-full bg-white lg:w-full rounded border border-gray-300"
              >
                <ul>
                  {postQuery.map((post) => (
                    <li>
                      <Link
                        to={`/post/${post._id}`}
                        className="text-base lg:text-lg font-semibold px-2 py-3 hover:bg-gray-100 block"
                      >
                        <span className="text-sm text-gray-500 font-normal block">
                          @{post.userDetails.userName}
                        </span>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>

        {!user ? (
          <>
            <button
              ref={mobileIcon}
              className="lg:hidden rounded-md py-1 px-1 hover:bg-teal/10"
              onClick={() => {
                if (window.screen.width <= 1024) {
                  setToggleMobileIcon((prev) => !prev);
                }
              }}
            >
              <BsThreeDots className="w-6 h-6" />
            </button>
            {/* mobile */}
            {window.screen.width <= 1024 && toggleMobileIcon && (
              <ul
                ref={mobileIconBox}
                className="absolute top-full right-0 bg-white p-2 border border-gray-200 rounded-md flex flex-col gap-1"
              >
                <li>
                  <Link
                    className="block p-1 text-base text-gray-600 hover:bg-teal/10 rounded-md"
                    to="/login"
                  >
                    Log in
                  </Link>
                </li>
                <li className="border-t pt-1 border-t-gray-200">
                  <Link
                    className="block p-1 text-base text-gray-600 hover:bg-teal/10 rounded-md"
                    to="/register"
                  >
                    Create account
                  </Link>
                </li>
              </ul>
            )}

            {/* desktop */}
            {window.screen.width > 1024 && (
              <ul className="flex gap-2">
                <li>
                  <Link
                    className="px-2.5 py-2 text-base font-medium hover:bg-teal/10 hover:text-teal text-teal border border-transparent rounded-md"
                    to="/login"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    className="px-2.5 py-2 font-medium hover:bg-teal hover:border-teal text-base text-teal hover:text-white border border-teal rounded-md"
                    to="/register"
                  >
                    Create account
                  </Link>
                </li>
              </ul>
            )}
          </>
        ) : (
          <div className="relative lg:w-2/5 flex gap-5 lg:justify-end">
            <Link
              to="/write"
              className="hidden lg:block py-2 px-2.5 font-medium text-base text-teal-dark border rounded-md border-teal-dark hover:bg-teal-dark hover:text-white hover:underline"
            >
              Create Post
            </Link>
            <button ref={userToggle} onClick={() => setToggleDropdown((prev) => !prev)}>
              <img
                className="w-10 h-10 object-cover border border-transparent rounded-full cursor-pointer hover:border hover:border-teal"
                // src={"http://localhost:5000/images/" + user.profilePicture}
                src={user.profilePicture}
                alt="profile picture"
              />
            </button>
            {toggleDropdown && (
              <div ref={userDropdown} className="z-20 absolute min-w-60 w-max right-0 top-full mt-1 bg-white p-2 rounded-md border border-gray-300">
                <ul className="flex flex-col gap-1">
                  <li className="border-b pb-1 border-b-gray-300">
                    <Link
                      to={`/${user.userName}`}
                      className="block p-2 rounded-md hover:bg-teal/10"
                    >
                      <span className="block text-base font-medium text-gray-700">
                        {user.name}
                      </span>
                      <span className="block text-sm text-gray-400">
                        {user.userName}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/write"
                      className="block p-2 rounded-md text-base text-gray-700 hover:bg-teal/10 hover:text-teal"
                    >
                      Create Post
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/readinglist"
                      className="block p-2 rounded-md text-base text-gray-700 hover:bg-teal/10 hover:text-teal"
                    >
                      Reading List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block p-2 rounded-md text-base text-gray-700 hover:bg-teal/10 hover:text-teal"
                    >
                      Settings
                    </Link>
                  </li>
                  <li className="border-t pt-1 border-t-gray-300">
                    <Link
                      to="/confirm_signout"
                      className="block p-2 rounded-md text-base text-gray-700 hover:bg-teal/10 hover:text-teal"
                    >
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
