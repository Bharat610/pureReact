import React from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Posts from "../components/Posts";
import Footer from "../components/Footer";

export default function CategoryPage() {
  const [searchparams, setSearchParams] = useSearchParams();
  const [categoryData, setCategoryData] = React.useState("");
  const [categoryPosts, setCategoryPosts] = React.useState("");
  const [error, setError] = React.useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  async function getCategoryData() {
    const fetchCategory = await fetch(
      "/api/categories/single/?name=" + searchparams.get("name")
    );
    if (fetchCategory.status === 404) {
      setError("Category does not exist!");
      return;
    } else if (!fetchCategory.ok) {
      setError("Something went wrong: " + fetchCategory.statusText);
      return;
    }
    const res = await fetchCategory.json();
    setCategoryData(res);
  }

  async function getCategoryPosts() {
    try {
      const getPosts = await fetch("/api/posts/" + location.search);
      if (getPosts.status === 404) {
        setError("No posts found for the specified category!");
        return;
      } else if (!getPosts.ok) {
        setError("Something went wrong: " + getPosts.statusText);
        return;
      }
      const res = await getPosts.json();
      setCategoryPosts(res);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    if(!searchparams.has("name")){
      navigate("/")
      return
  }
    getCategoryData();
    getCategoryPosts();
  }, [searchparams]);

  return (
    <>
      <TopBar />
      <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 max-w-screen-desktop m-auto flex flex-col gap-5">
          {error ? (
            <div className="bg-white p-5">
              <p className="text-black text-base font-semi-bold">{error}</p>
            </div>
          ) : (
            <>
            {categoryData && 
              <div className="bg-white p-5 rounded border-t-4 border-t-teal">
                <h1 className="text-2xl font-bold text-black">
                  #{categoryData.name}
                </h1>
                <p className="text-base mt-1 text-black">{categoryData.desc}</p>
              </div>
              }
              {categoryPosts && <Posts post={categoryPosts} />}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
