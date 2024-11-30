import React from "react";
import { Link } from "react-router-dom";
import { FaHashtag } from "react-icons/fa6";

export default function Sidebar() {
  const [categories, setCategories] = React.useState([]);

  async function getCategories() {
    const fetchCategories = await fetch("/api/categories");
    const res = await fetchCategories.json();
    setCategories(res);
  }

  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <>

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
    </>
  );
}
