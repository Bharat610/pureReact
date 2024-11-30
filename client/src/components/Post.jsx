import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaRegThumbsUp } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { Context } from "../context/Context";
import { useHandleReadingList } from "../utils/handleReadingList";


export default function Post({ post, isBookmarked, isLoading }) {
  const { user, dispatch } = useContext(Context);

  const handleReadingList = useHandleReadingList();

  return (
    <>
      <div className="w-full lg:w-[48.9%] flex flex-col bg-white border border-gray-200 rounded-md p-5 gap-1.5">
        <div className="flex items-center gap-2">
          <Link
            to={"/" + post.userDetails.userName}
            className="hover:bg-gray-100"
          >
            <img
              src={"http://localhost:5000/images/" + post.userDetails.userPhoto}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <span className="text-sm text-gray-700 font-medium">
              <Link
                to={"/" + post.userDetails.userName}
                className="hover:bg-gray-100"
              >
                {" "}
                {post.userDetails.userName}
              </Link>
            </span>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString("default", {
                day: "2-digit",
                month: "short",
              })}
            </span>
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
              className="text-sm text-gray-600 p-1 cursor-pointer rounded border border-transparent hover:bg-gray-100 hover:border-gray-200"
            >
              #{category}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-2.5 flex justify-between">
          <Link to={"/post/" + post._id} className="flex">
            <div className="flex gap-5 p-1 rounded border border-transparent hover:bg-gray-100 hover:border-gray-200">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FaRegThumbsUp className="w-4 h-4 text-black" />{" "}
                <span>
                  {post.likesCount} {post.likesCount === 1 ? "Like" : "Likes"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FaRegComment className="w-4 h-4 text-black" />{" "}
                <span>{post.comments.length} Comments</span>
              </div>
            </div>
          </Link>
          <div
            className="p-2 rounded cursor-pointer hover:bg-teal/10"
            onClick={() => handleReadingList(isBookmarked, post._id)}
          >
            {isBookmarked ? (
              <FaBookmark className="w-5 h-5" />
            ) : (
              <FaRegBookmark className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

    </>
  );
}
