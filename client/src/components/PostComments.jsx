import React, { useContext, useRef } from "react";
import { Context } from "../context/Context";
import { Link } from "react-router-dom";
import { FaDigitalOcean } from "react-icons/fa6";

export default function PostComment({ post }) {
  const [commentText, setCommentText] = React.useState("");
  const [commentBox, setCommentBox] = React.useState(post.comments);
  const { user } = useContext(Context);
  const dialogRef = useRef(null);

  async function handleComment(e) {
    e.preventDefault();
    try {
      const postComment = await fetch("`https://purereact-api.onrender.com/api/posts/comments/" + post._id, {
        method: "PUT",
        body: JSON.stringify({
          userId: user._id,
          userName: user.userName,
          userProfile: user.profilePicture,
          comment: commentText,
          timestamp: new Date(),
        }),
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (postComment.status === 400) {
        alert("you cannot add one than one comment!");
        return;
      }
      if (!postComment.ok && postComment.status !== 400) {
        console.log(postComment.statusText);
        return;
      }
      const res = await postComment.json();
      setCommentBox(res);
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  async function handleCommentDelete() {
    try {
      const deleteComment = await fetch("/api/posts/comments/" + post._id, {
        method: "DELETE",
        body: JSON.stringify({
          userId: user._id,
        }),
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const res = await deleteComment.json();
      handleDialog();
      setCommentBox(res);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <h3 className="text-2xl text-black font-semibold">Comments</h3>
      <form onSubmit={handleComment}>
        <div className="flex gap-4 mt-2.5">
          <img
          src={user.profilePicture}
            // src={`http://localhost:5000/images/${
            //   user ? user.profilePicture : "userDefault.png"
            // }`}
            alt="user profile picture"
            className="w-11 h-11 rounded-full object-cover"
          />
          <textarea
            className="placeholder:text-gray-600 p-5 border border-gray-200 w-full text-lg"
            placeholder="Post a comment..."
            name="comment"
            onChange={(e) =>
              user
                ? setCommentText(e.target.value)
                : alert("you need to login to post a comment!")
            }
            value={commentText}
          ></textarea>
        </div>
        {user && (
          <button
            className="mt-2.5 ml-14 bg-teal hover:bg-teal-dark text-white rounded-md py-2.5 px-5"
            type="submit"
          >
            Submit
          </button>
        )}
      </form>
      {commentBox.length > 0 && (
        <div className="mt-5 flex flex-col bg-white border border-gray-200 p-7 rounded-md gap-6">
          {commentBox.map((text) => (
            <div key={text.userId} className="flex gap-4 items-start">
              <Link to={"/" + text.userName}>
                <img
                  src={text.userProfile}
                  alt="user profile picture"
                  className="w-9 h-9 rounded-full object-cover"
                />
              </Link>
              <div
                className={`${
                  text.userId === user?._id
                    ? "border-2 border-gray-300"
                    : "border border-gray-200"
                } rounded-md p-2.5 w-full`}
              >
                <div className="flex gap-2">
                  <span className="text-base text-gray-700 font-medium hover:bg-gray-200">
                    <Link to={"/" + text.userName}>{text.userName}</Link>
                  </span>
                  <span className="text-base text-gray-500">
                    {" " +
                      new Date(text.timestamp).toLocaleString("default", {
                        day: "2-digit",
                        month: "short",
                      })}
                  </span>
                  {text.userId === user?._id && (
                    <>
                      <span
                        onClick={handleDialog}
                        className="ml-auto font-medium cursor-pointer text-base text-red-600 hover:text-red-700"
                      >
                        Delete
                      </span>
                      <dialog ref={dialogRef}>
                        <div className="flex p-10 flex-col items-center gap-10">
                          <h3 className="text-2xl text-black font-semibold">
                            Are you sure you want to delete the comment?
                          </h3>
                          <div className="flex gap-2.5">
                            <button
                              onClick={handleCommentDelete}
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
                <p className="mt-1.5 text-gray-600 text-base">{text.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
