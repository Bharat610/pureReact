import React, { useContext } from "react";
import { Context } from "../context/Context";
import TopBar from "../components/TopBar";
import Post from "../components/Post";
import { FaRegBookmark } from "react-icons/fa6";
import Posts from "../components/Posts";
import Footer from "../components/Footer";

export default function ReadingList() {
  const { user } = useContext(Context);

  const [readingPost, setReadingPost] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  async function userReadingList() {
    try {
      setLoading(true);
      const fetchReadingList = await fetch(
        "/api/posts/readinglist/?id=" + user._id
      );
      if (!fetchReadingList.ok) {
        console.log(fetchReadingList);
        return;
      }
      const res = await fetchReadingList.json();
      setReadingPost(res);
      setLoading(false);
    } catch (err) {
      console.log("dont know");
      console.log(err);
    }
  }

  React.useEffect(() => {
    userReadingList();
  }, [user.readingList]);

  return (
    <>
      <TopBar />
      <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 max-w-screen-desktop m-auto flex flex-col gap-5">
          <h1 className="text-2xl text-black font-semibold">
            Reading List ({user.readingList.length})
          </h1>
            {loading ? (
              <h2 className="text-lg text-black">Loading...</h2>
            ) : readingPost.length !== 0 ? 
            <Posts post={readingPost} />
            // (
            //   readingPost.map((post) => <Post key={post._id} post={post} isBookmarked={user?.readingList.includes(post._id)} />)
            // )
             : (
              <p className="text-lg font-semibold text-gray-600">
                Your reading list is empty.
                <span className="text-base font-normal block">Save a post to your Reading List by clicking on the bookmark <FaRegBookmark className="inline" /> icon.</span>
              </p>
            )}
          
        </div>
      </div>
      <Footer />
    </>
  );
}
