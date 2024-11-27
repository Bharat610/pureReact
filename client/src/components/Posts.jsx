import React, { useContext } from "react";
import Post from "./Post.jsx";
import { NavLink } from "react-router-dom";
import { Context } from "../context/Context.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import LoadingSkeleton from "./LoadingSkeleton.jsx";

export default function Posts({ post, isLoading, error, getPosts }) {
  const { user } = useContext(Context);
  const arr = [5];

  const postLoop = post.map((post) => {
    return (
      <Post
        key={post._id}
        post={post}
        isBookmarked={user?.readingList.includes(post._id)}
        isLoading={isLoading}
      />
    );
  });

  return (
    <>
        {isLoading && <LoadingSkeleton count={6} />}

      <div className="flex flex-col flex-wrap lg:flex-row gap-2.5 lg:gap-5">
        {post && postLoop}
      </div>
    </>
  );
}
