import React from "react";
import Posts from "../components/Posts";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { useSearchParams, useLocation, NavLink } from "react-router-dom";
import Login from "./login/Login";
import Footer from "../components/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function Home() {
  const [post, setPost] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMorePosts, setHasMorePosts] = React.useState(true);
  const [error, setError] = React.useState("");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();


  async function getPosts(page = pageCount) {
    if ((loading || !hasMorePosts)) {
      return;
    }

    try {
      setLoading(true);
      const fetchPost = await fetch(
        `/api/posts/?page=${page}${
          searchParams.has("sort") ? "&sort=" + searchParams.get("sort") : ""
        }`
      );
      if (!fetchPost.ok) {
        setError("Error: " + fetchPost.statusText);
        setLoading(false);
        return;
      }
      const response = await fetchPost.json();
      setLoading(false);
      setPost((prevPosts) => (page === 1 ? response : [...prevPosts, ...response]));
      setHasMorePosts(response.length === 8);
      setError("");
    } catch (err) {
      setError("Something went wrong!");
    }
  }

  React.useEffect(() => {
    console.log("ahh shit.. here we go again")
    setPageCount(1);
    setPost([]);
    setHasMorePosts(true);
  }, [location.search]);

  React.useEffect(() => {
      getPosts();
  }, [pageCount, location.search]);


  return (
    <>
      <TopBar />
      <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 lg:max-w-screen-desktop m-auto flex flex-col lg:flex-row items-start gap-5">
          {window.screen.width > 1024 && (
            <div className="lg:w-[20%]">
              <Sidebar />
            </div>
          )}
          <div className="lg:w-[80%]">
            <ul className="flex gap-5 w-full text-gray-600 mb-2.5">
              <li>
                <NavLink
                  end
                  to="/?sort=popular"
                  style={({ isActive }) =>
                    isActive && searchParams.get("sort") !== "latest"
                      ? { fontWeight: "600", color: "#000" }
                      : null
                  }
                >
                  Popular
                </NavLink>
              </li>
              <li>
                <NavLink
                  end
                  to="/?sort=latest"
                  style={({ isActive }) =>
                    isActive && searchParams.get("sort") === "latest"
                      ? { fontWeight: "600", color: "#000" }
                      : null
                  }
                >
                  Latest
                </NavLink>
              </li>
            </ul>

            <InfiniteScroll
              dataLength={post.length}
              hasMore={hasMorePosts}
              next={() => setPageCount((prev) => prev + 1)}
              scrollThreshold={1}
              loader={
                <div className="mt-10">
                <LoadingSkeleton count={2} />
                </div>
              }
              endMessage={
                <p className="mt-10 text-center">
                  <b>You have seen it all</b>
                </p>
              }
            >
              {post && (
                <Posts
                  post={post}
                  isLoading={loading}
                  error={error}
                  getPosts={getPosts}
                />
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
