const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require("mongoose");
const { authenticateToken } = require("./auth");

//CREATE POST
router.post("/", authenticateToken, async (req, res) => {
  if(req.user.userName !== req.body.userDetails.userName){
    return res.status(403).json("User not authorized")
  }
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if(!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if(post.userDetails.userName !== req.user.userName) {
      return res.status(403).json({ message: "You can update only your own post" });
    }

      try {
        const validFields = ['title', 'desc', 'categories', 'photo'];
        const updateKeys = Object.keys(req.body);
        const isValidRequest = updateKeys.every(field => validFields.includes(field))

        if(!isValidRequest) {
          return res.status(400).json({message: "Invalid Updates!"})
        }

        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    }
   catch (err) {
    res.status(500).json(err.message);
  }
});

//Reactions handle
router.put("/reactions/:id", authenticateToken, async (req, res) => {
  const userId = req.body.userId;
  try {
    const post = await Post.findById(req.params.id);
    if(!post) {
      return res.status(400).json("post doesn't exist")
    }
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((likedUserId) => likedUserId !== userId);
      post.likesCount = post.likes.length;
      await post.save();
      return res.status(200).json(post);
    } else {
      post.likes.push(userId);
      post.likesCount = post.likes.length;
      await post.save();
      return res.status(200).json(post);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
});

//comment handle
router.put("/comments/:id", authenticateToken, async (req, res) => {
  const userId = req.body.userId;
  try {
    const post = await Post.findById(req.params.id);
    if(!post) {
      return res.status(400).json("post doesn't exist")
    }
    if (post.comments.some((comment) => comment.userId === userId)) {
      return res.status(400).json("your comment already exist");
    }

    post.comments.unshift(req.body);
    await post.save();

    return res.status(200).json(post.comments);
  } catch (err) {
    console.log(err.message);
  }
});

//comment delete
router.delete("/comments/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) {
      return res.status(400).json("post doesn't exist")
    }
    post.comments = post.comments.filter(
      (comment) => comment.userId !== req.body.userId
    );
    await post.save();
    return res.status(200).json(post.comments);
  } catch (err) {
    console.log(err.message);
  }
});

//DELETE POST
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (post.userDetails.userName !== req.user.userName) {
      return res.status(403).json("you can delete only your post");
    }
    await post.deleteOne();
    return res.status(200).json("post has been deleted");
  } catch (err) {
    console.error("Error finding the post:", err);
    res.status(500).json(err);
  }
});

//GET ALL POST
router.get("/", async (req, res) => {
  const pageNo = req.query.page;
  const username = req.query.user;
  const catName = req.query.name;
  const userPosts = req.query.userName;
  const search = req.query.search;
  const sort = req.query.sort;

  try {
    let posts;
    if (userPosts) {
      posts = await Post.find({ "userDetails.userName": userPosts });
      if (posts.length === 0) {
        return res.status(404).json("No post found");
      }
      return res.status(200).json(posts);
    } else if (sort === "latest") {
      posts = await Post.find().sort({ _id : -1 }).skip((pageNo-1)*8).limit(8);
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
      if(posts.length === 0){
        return res.status(404).json("No post found for the specified category!")
      }
    } else if (search) {
      posts = await Post.find({ title: { $regex: search, $options: "i" } }).sort({ likesCount: -1, _id: 1 }).limit(5);
      if (posts.length === 0) {
        return res.status(404).json("No post found");
      }
    } else {
      // posts = await Post.aggregate([
      //     {
      //       $addFields: {
      //         likesCount: { $size: "$likes" }
      //       }
      //     },
      //     {
      //       $sort: { likesCount: -1 }
      //     }
      //   ]);
      posts = await Post.find().sort({ likesCount: -1, _id: 1  }).skip((pageNo-1)*8).limit(8);
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get user reading List posts
router.get("/readinglist", async (req, res) => {
  const user_id = req.query.id;
  try {
    const user = await User.findOne({ _id: user_id });
    //check if user exist, else send 404
    if (!user) {
      return res.status(404).json("No user found");
    }
    // const userReadingList = user.readingList.map(id => mongoose.Types.ObjectId(id));
    const readingPost = await Post.find({ _id: { $in: user.readingList } });
    return res.status(200).json(readingPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get related posts based on categories on single page
router.get("/related/categories/:id", async (req, res) => {
  const postId = req.params.id;
  const categories = req.query.categories.split(",");
  try {
    const posts = await Post.find({
      _id: { $ne: postId },
      categories: { $all: categories },
    })
      .sort({ likesCount: -1 })
      .limit(5);
    return res.status(200).json(posts);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
