import React, { useContext } from "react";

import {
  useParams,
  useLocation,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import TopBar from "../components/TopBar";
import { Context } from "../context/Context";
import { FaRegThumbsUp } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { useHandleReadingList } from "../utils/handleReadingList";
import PostComment from "../components/PostComments";
import DOMPurify from 'dompurify';
import Footer from "../components/Footer";

export default function Single() {
  const params = useParams();
  const handleReadingList = useHandleReadingList();
  const navigate = useNavigate();

  const [singlePost, setSinglePost] = React.useState(null);
  const [postUser, setPostUser] = React.useState(null);
  const [relatedPost, setRelatedPost] = React.useState(null);
  const { user } = useContext(Context);

  const isBookmarked = user?.readingList.includes(params.postId);
  const postId = params.postId;

  //fetching post data
  async function getSinglePost() {
    try {
      const fetchSinglePost = await fetch(`/api/posts/${params.postId}`);
      if (fetchSinglePost.status === 404) {
        return navigate("/404");
      } else if (!fetchSinglePost.ok) {
        return <h2>Something went wrong</h2>;
      }
      const res = await fetchSinglePost.json();
      await fetchPostUser(res.userDetails.userName);
      setSinglePost(res);
    } catch (err) {
      console.log(err);
    }
  }

  //post user info
  async function fetchPostUser(username) {
    try {
      const getUser = await fetch("/api/users/" + username);
      if (!getUser.ok) {
        return <h2>Something went wrong</h2>;
      }
      const res = await getUser.json();
      setPostUser(res);
    } catch (err) {
      console.log(err);
    }
  }

  //cleaning desc content for xss attack
  const cleanDesc = DOMPurify.sanitize(singlePost?.desc);

  //post like and dislike feature
  async function fetchLikes() {
    try {
      if (!user) {
        alert("you need to login to like the post");
        return;
      }
      const likes = await fetch("/api/posts/reactions/" + params.postId, {
        method: "PUT",
        body: JSON.stringify({
          userId: user._id,
        }),
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!likes.ok) {
        console.log(likes.statusText);
        return;
      }
      const res = await likes.json();
      setSinglePost(res);
    } catch (err) {
      console.log(err);
    }
  }

  //fetching related posts based on current post category
  async function relatedPosts() {
    try {
      const fetchRelatedPosts = await fetch(
        `/api/posts/related/categories/${singlePost._id}/?categories=${singlePost.categories.toString()}`
      );
      const res = await fetchRelatedPosts.json();
      setRelatedPost(res);
    } catch (err) {
      console.log(err);
    }
  }

  //only run the related Post code after the single post data has loaded
  // if (!relatedPost && singlePost) {
  //   relatedPosts();
  // }


  React.useEffect(() => {
      getSinglePost();

  }, [params.postId]);

  React.useEffect(() => {
    if(singlePost){
      relatedPosts();
    }
  }, [singlePost])

  return (
    <>
      <TopBar />
      <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 max-w-screen-desktop m-auto flex flex-col lg:flex-row items-start gap-5">
          <div className="w-full lg:w-3/4">
            {singlePost && (
              <>
              {singlePost.photo &&
                <img
                className="w-full h-50 lg:h-80 object-cover rounded-t-md"
                // src={`http://localhost:5000/images/${singlePost.photo}`}
                src={singlePost.photo}
                alt=""
                />
              }
                <div className="p-5 lg:p-10 bg-white border border-gray-200 flex flex-col gap-5">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={`http://localhost:5000/images/${singlePost.userDetails.userPhoto}`}
                        alt=""
                        className="w-11 h-11 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-base text-gray-700 font-medium">
                          {singlePost.userDetails.userName}
                        </span>
                        <span className="text-base text-gray-500">
                          Posted on
                          {" " +
                            new Date(singlePost.createdAt).toLocaleString(
                              "default",
                              {
                                day: "2-digit",
                                month: "short",
                              }
                            )}
                        </span>
                      </div>
                    </div>
                    <div
                      className="p-2 rounded cursor-pointer hover:bg-teal/10"
                      onClick={() => handleReadingList(isBookmarked, postId)}
                    >
                      {isBookmarked ? (
                        <FaBookmark className="w-7 h-7" />
                      ) : (
                        <FaRegBookmark className="w-7 h-7" />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-5">
                      <div
                        className="flex items-center border cursor-pointer border-transparent rounded-md gap-1.5 p-1 hover:bg-teal/10 hover:border-teal/10"
                        onClick={fetchLikes}
                      >
                        {singlePost.likes.includes(user?._id) ? (
                          <>
                            <FaHeart className="w-5 h-5 text-teal-dark text-black" />
                            <span className="text-base text-teal-dark font-semibold">
                              {singlePost.likesCount}{" "}
                              {singlePost.likesCount === 1 ? "Like" : "Likes"}
                            </span>
                          </>
                        ) : (
                          <>
                            <FaRegHeart className="w-5 h-5 text-black" />
                            <span className="text-base text-gray-600">
                              {singlePost.likes.length}{" "} 
                              {singlePost.likesCount === 1 ? "Like" : "Likes"}
                            </span>
                          </>
                        )}
                      </div>

                      <div
                        className="flex items-center border cursor-pointer border-transparent rounded-md gap-1.5 p-1 hover:bg-teal/10 hover:border-teal/10"
                        onClick={() =>
                          document
                            .getElementById("comments")
                            .scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <FaRegComment className="w-5 h-5 text-black" />
                        <span className="text-base text-gray-600">
                          {singlePost.comments.length} comments
                        </span>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-black text-2xl lg:text-4xl font-semibold leading-normal">
                    {singlePost.title}
                  </h1>
                  <div className="flex flex-wrap gap-x-2 gap-y-px">
                    {singlePost.categories.map((category, index) => (
                      <Link
                        to={"/category/?name=" + category}
                        key={index + 1}
                        className="text-base text-gray-600 p-1 cursor-pointer rounded border border-transparent hover:bg-gray-100 hover:border-gray-200"
                      >
                        #{category}
                      </Link>
                    ))}
                  </div>
                  <div className="text-editor text-black text-base lg:text-xl leading-8" 
                    dangerouslySetInnerHTML = {{__html: cleanDesc}}
                  />

                </div>
                <div className="mt-5 lg:mt-10" id="comments">
                  <PostComment post={singlePost} />
                </div>
              </>
            )}
          </div>
          <div className="w-full lg:w-1/4 flex flex-col gap-5">
            {postUser && (
              <div className="flex p-5 flex-col bg-white border border-gray-200 rounded-md">
                <div className="flex gap-2.5 items-center">
                  <Link to={"/" + postUser.userName} className="flex">
                    <img
                      // src={`http://localhost:5000/images/${postUser.profilePicture}`}
                      src={postUser.profilePicture}
                      alt="Post user profile picture"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-black">
                      {postUser.name}
                    </h3>
                    <span className="text-base -mt-1 text-gray-600">
                      @{postUser.userName}
                    </span>
                  </div>
                </div>
                <div className="mt-2 mb-4">
                  <span className="block font-semibold text-base text-gray-600">
                    Joined
                  </span>
                  <span className="block text-base text-gray-600">
                    {new Date(postUser.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Link
                  to={"/" + postUser.userName}
                  className="text-center rounded-md w-full py-2 text-base text-white bg-teal font-medium hover:bg-teal-dark"
                >
                  Visit Profile
                </Link>
              </div>
            )}
            {relatedPost?.length > 0 && (
              <div className="flex p-5 flex-col bg-white border border-gray-200 rounded-md">
                <h2 className="text-xl text-black font-semibold">
                  Related Posts
                </h2>
                {relatedPost.map((post) => (
                  <div className="flex py-2.5 flex-col gap-1">
                    <Link  to={"/post/"+ post._id} className="text-lg flex text-black hover:text-teal">
                      {post.title}
                    </Link>
                    <div className="flex flex-wrap gap-x-2 gap-y-px">
                      {post.categories.map((category, index) => (
                        <span
                          key={index + 1}
                          className="text-sm text-gray-600 p-1 cursor-pointer rounded border border-transparent hover:bg-gray-100 hover:border-gray-200"
                        >
                          #{category}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}