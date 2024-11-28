import React from "react";
import { Link } from "react-router-dom";
import { FaHashtag } from "react-icons/fa6";

export default function Sidebar() {
  const [categories, setCategories] = React.useState([]);

  async function getCategories() {
    const fetchCategories = await fetch("https://purereact-api.onrender.com/api/categories");
    const res = await fetchCategories.json();
    setCategories(res);
  }

  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
    {/* className="w-1/4 bg-white p-2.5 rounded-md border border-gray-200" */}

        <ul className="list-none p-0 m-0">
          {categories &&
            categories.map((category) => {
              return (
                <li key={category._id}>
                  <Link
                    to={`/category/?name=${category.name}`}
                    className="group p-2.5 block rounded-md hover:bg-teal/10"
                    >
                    <div className="flex gap-1 items-center">
                      <FaHashtag className="w-3 h-3 text-gray-600 group-hover:text-teal" /><h3 className="text-base text-gray-600 group-hover:text-teal">
                        {category.name}
                      </h3>
                    </div>
                    {/* <p className="mt-0.5 text-base text-gray-500">
                      {category.desc}
                    </p> */}
                  </Link>
                </li>
              );
            })}
        </ul>

      {/* <div className="sidebar">
        <div className="sidebar-Item">
        <h4 className="sidebar_title">ABOUT ME</h4>
          <img src="./src/assets/pexels-photo-415829.webp" alt="User Image" />
          <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet a
            delectus illo sit autem amet hic, fugiat quae reprehenderit minus
            mollitia
          </p>
        </div>

        <div className="sidebar-Item">
          <h4 className="sidebar_title">CATEGORIES</h4>
          <ul className="sidebarList">
            {categories &&
              categories.map((category) => {
                return (
                  <Link
                    to={`/?cat=${category.name}`}
                    key={category._id}
                    className="link"
                  >
                    <li className="sidebarListItem">{category.name}</li>
                  </Link>
                );
              })}
          </ul>
        </div>

        <div className="sidebar-Item">
          <h4 className="sidebar_title">FOLLOW US</h4>
          <div className="sidebarSocial">
            <i className="fa-brands fa-square-facebook"></i>
            <i className="fa-brands fa-square-twitter"></i>
            <i className="fa-brands fa-square-pinterest"></i>
            <i className="fa-brands fa-square-instagram"></i>
          </div>
        </div>
      </div> */}
    </>
  );
}
