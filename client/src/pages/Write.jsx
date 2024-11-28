import React, { useContext } from "react";
import TopBar from "../components/TopBar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Oval } from "react-loader-spinner";
import Footer from "../components/Footer";

import { Context } from "../context/Context";
import { useLocation } from "react-router-dom";

export default function Write() {
  const { user } = useContext(Context);

  const { state } = useLocation();

  const [uploadData, setUploadData] = React.useState({
    userDetails: {
      userName: user.userName,
      userPhoto: user.profilePicture,
    },
    title: state ? state.title : "",
    desc: state ? state.desc : "",
    categories: state ? state.categories : [],
    photo: state ? state.photo : "",
  });

  const [categories, setCategories] = React.useState("");
  const [reactQuillData, setReactQuillData] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function getImage() {
    if (uploadData.photo === "") {
      return "";
    } else if (typeof uploadData.photo === "object") {
      const formData = new FormData();
      // const filename = Date.now() + uploadData.photo.name;
      // formData.append("name", filename);
      formData.append("file", uploadData.photo);

      try {
        const imageData = await fetch("https://purereact-api.onrender.com/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!imageData.ok) {
          console.log(imageData.statusText);
          return;
        }
        const res = await imageData.json();
        return res.url;
      } catch (err) {
        console.log(err);
      }
      // console.log(filename);
      // return filename;
    } else {
      return uploadData.photo;
    }
  }

  async function getCategories() {
    try {
      const getData = await fetch("https://purereact-api.onrender.com/api/categories");
      if (!getData.ok) {
        setError("Failed to fetch categories: " + getData.statusText);
      }
      const res = await getData.json();
      setCategories(res);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    getCategories();
  }, []);

  //new post data publish and update existing post data
  async function handleSubmit(e) {
    e.preventDefault();
    if (state) {
      setLoading(true);
      try {
        const { userDetails, ...otherData } = uploadData;
        const updatePost = await fetch("https://purereact-api.onrender.com/api/posts/" + state._id, {
          method: "PUT",
          body: JSON.stringify({
            ...otherData,
            photo: await getImage(),
          }),
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!updatePost.ok) {
          setLoading(false);
          setError("Error updating post " + updatePost.statusText);
          return;
        }
        const data = await updatePost.json();
        setLoading(false);
        setError("");
        window.location.replace("/post/" + data._id);
      } catch (err) {
        console.log(err);
      }
    } else {
      setLoading(true);
      try {
        const newPost = await fetch("https://purereact-api.onrender.com/api/posts", {
          method: "POST",
          body: JSON.stringify({
            ...uploadData,
            photo: await getImage(),
          }),
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!newPost.ok) {
          setLoading(false);
          setError("Error publishing post " + updatePost.statusText);
          return;
        }
        const data = await newPost.json();
        setLoading(false);
        setError("");
        window.location.replace("/post/" + data._id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const modules = {
    toolbar: [
      [{ header: [2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  function handleCategorySelection(category) {
    if (!uploadData.categories.includes(category)) {
      setUploadData((prev) => ({
        ...prev,
        categories: [...uploadData.categories, category],
      }));
    } else {
      setUploadData((prev) => ({
        ...prev,
        categories: uploadData.categories.filter((item) => item !== category),
      }));
    }
  }

  return (
    <>
      <TopBar />
      <div className="px-5 lg:px-10">
        <div className="py-5 lg:py-10 max-w-screen-xl m-auto">
          <div className="p-5 lg:p-10 bg-white w-full lg:w-3/4 border-gray-200 border-2 rounded-md">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="flex gap-5 lg:gap-10 items-center">
                {uploadData.photo && (
                  <img
                    src={
                      typeof uploadData.photo === "object"
                        ? URL.createObjectURL(uploadData.photo)
                        : uploadData.photo
                      // "http://localhost:5000/images/"+uploadData.photo
                    }
                    className="w-20 lg:w-40 h-20 lg:h-40 object-scale-down"
                  />
                )}
                <div className="flex items-center">
                  <label
                    className="py-2 lg:py-2.5 px-2.5 lg:px-5 rounded-md border-2 border-gray-500 cursor-pointer text-gray-600"
                    htmlFor="fileUpload"
                  >
                    {uploadData.photo ? "Change" : "Add cover image"}
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      name="file"
                      onChange={(e) =>
                        e.target.files[0] &&
                        setUploadData((prev) => ({
                          ...prev,
                          photo: e.target.files[0],
                        }))
                      }
                    />
                  </label>
                  {uploadData.photo && (
                    <button
                      className="rounded-none border-0 p-2.5 lg:p-5 text-red-600"
                      onClick={(e) =>
                        setUploadData((prev) => ({ ...prev, photo: "" }))
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <input
                  type="text"
                  className="placeholder:text-gray-600 p-5 pl-0 focus:outline-none border-0 w-full text-lg lg:text-3xl"
                  placeholder="Add post title here..."
                  value={uploadData.title}
                  name="title"
                  autoFocus={true}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="mt-5">
                <ReactQuill
                  theme="snow"
                  className="text-lg h-[500px] w-full"
                  modules={modules}
                  placeholder="Write post content here..."
                  name="desc"
                  value={uploadData.desc}
                  onChange={(content) =>
                    setUploadData((prev) => ({ ...prev, desc: content }))
                  }
                />
              </div>
              <div className="flex flex-col mt-32 lg:mt-20 gap-2.5">
                <h3 className="text-2xl">Choose category</h3>
                <p className="text-base text-gray-600 mb-2.5">
                  Select up to 3 category...
                </p>
                {categories &&
                  categories.map((category) => (
                    <div key={category._id} className="flex gap-1 items-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        id={category.name}
                        name="category"
                        value={category.name}
                        checked={uploadData.categories.includes(category.name)}
                        disabled={
                          uploadData.categories.length >= 3 &&
                          !uploadData.categories.includes(category.name)
                        }
                        onChange={(e) => handleCategorySelection(category.name)}
                      />
                      <label htmlFor={category.name}>{category.name}</label>
                    </div>
                  ))}
              </div>
              <div className="mt-7 flex items-center gap-2.5">
              <button
                className={`bg-teal hover:bg-teal-dark text-white rounded-md py-2.5 px-5 ${
                  loading && "bg-teal/70 cursor-not-allowed hover:bg-teal/70"
                }`}
                type="submit"
                disabled={loading}
              >
                {state ? "Update" : "Publish"}
              </button>
              {loading && <Oval color="teal" width="20" height="20" strokeWidth="4" />}
              </div>
            </form>

            {error && (
              <p className="p-2 mt-2.5 w-full lg:w-full border-l-4 border-red-600 bg-red-600/10 text-red-700 text-base font-semibold">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
