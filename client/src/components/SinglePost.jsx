import React, { useContext } from "react";
import { useParams, useLocation , Link} from "react-router-dom";
import TopBar from "../topBar/TopBar";
import { Context } from "../../context/Context";

export default function SinglePost() {
  const params = useParams();
  // const location  = useLocation()
  // const path = location.pathname.split("/")[2];

  const [singePost, setSinglePost] = React.useState([])
  const {user} = useContext(Context)

  async function getSinglePost() {
    const fetchSinglePost = await fetch(`https://purereact-api.onrender.com/api/posts/${params.postId}`)
    const res = await fetchSinglePost.json()
    setSinglePost(res)
  }

  React.useEffect(() => {
    getSinglePost()
  }, [])

  async function handleDelete() {
    try{
    const postDelete = await fetch(`https://purereact-api.onrender.com/api/posts/${singePost._id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'userName': user.userName 
      }
    })
    const res = await postDelete.json()
    alert(res)
    window.location.replace("/settings")
  }catch(err) {
     
    console.log(err)
  }
  }

  return (

    <div className="singlePost">
      <img
        className="singlePostImg"
        src={singePost.photo}
        alt=""
        />
      <div className="titleContainer">
        <h1 className="singlePostTitle">
          {singePost.title}
        </h1>
        {singePost.userName === user?.userName &&
        <div className="edit-container">
          <i className="fa-regular fa-pen-to-square"></i>
          <i className="fa-regular fa-trash-can" style={{ color: "#ff0000" }} onClick={handleDelete}></i>
        </div>
    }
      </div>
      <div className="singelPostInfo">
        <span className="singleAuthor">
          Author : <Link to={`/?user=${singePost.userName}`}> <b>{singePost.userName}</b> </Link>
        </span>
        <i className="fa-solid fa-circle small-circle"></i>
        <span className="siglePostTime">
          Published : <b>{new Date(singePost.createdAt).toDateString()}</b>
        </span>
      </div>
      <p className="singlePostDescription">
        {singePost.desc}
      </p>
    </div>

  );
}
