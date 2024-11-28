import React, {useContext} from "react";
import TopBar from "../components/TopBar";
import Post from "../components/Post";
import { useLocation, useSearchParams } from "react-router-dom";
import { Context } from "../context/Context";
import Posts from "../components/Posts";
import Footer from "../components/Footer";

export default function SearchPage() {

  const [qPost, setQpPost] = React.useState([]);
  const [params, setSearchParams] = useSearchParams();
  const {user} = useContext(Context)

console.log(params.toString())
  async function searchResults() {
    try {
      const searchPost = await fetch(`https://purereact-api.onrender.com/api/posts/?page=${1}/?search=${params.get("q")}`);
      if (searchPost.status === 404) {
        setQpPost([]);
        return 
      }
      const res = await searchPost.json();
      console.log(res);
      setQpPost(res);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    searchResults();
  }, []);

  return (
    <>
      <TopBar />
      <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 max-w-screen-desktop m-auto flex flex-col gap-2.5 lg:gap-5">
          <h1 className="text-xl text-black">
            Search results for:{" "}
            <span className="font-semibold">{params.get("q")}</span>
          </h1>
          
          {qPost.length === 0 ? (
           <div className="p-5 border border-gray-300 bg-white"> <h3 className="text-lg">No post found for the searched string.</h3></div>
          ) : (
            <Posts post={qPost} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
