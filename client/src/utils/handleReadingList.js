import React, { useContext } from "react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";

export function useHandleReadingList() {
  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate();

  const handleReadingList = async (isBookmarked, postId) => {

    try {
      if (!user) {
        alert("you need to login to save post");
        navigate("/login");
        return;
      }
      const readingListUpdate = await fetch("/api/users/" + user._id, {
        method: "PUT",
        body: JSON.stringify({
          userId: user._id,
          bookmarked: isBookmarked,
          postId: postId,
        }),
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!readingListUpdate.ok) {
        console.log("Error" + readingListUpdate.statusText);
        return;
      }
      const res = await readingListUpdate.json();
      dispatch({
        type: "UPDATE_SUCCESS",
        payload: res,
      });

      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  }

  return handleReadingList
}
