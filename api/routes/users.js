const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const {authenticateToken} = require('./auth')

//UPDATE
router.put("/:id", authenticateToken, async (req, res) => {
  try{
    const findUser = await User.findById(req.params.id)
    
    if(!findUser) {
      return res.status(400).json("you are not allowed to update this account");
    }

    if (req.user.userName !== findUser.userName) {
      return res.status(401).json("you are not authorized to update user data")
    }

      //for password
    if (req.body.currentPassword && req.body.newPassword) {
        // Validate current password
        const validate = await bcrypt.compare(req.body.currentPassword, findUser.password);
        if (validate) {
          // Hash the new password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
          
          // Update the password
          const updatedPassword = await User.findByIdAndUpdate(
            req.params.id,
            {
              password: hashedPassword,
            },
            { new: true }
          );
          const { password, ...others } = updatedPassword._doc;
          return res.status(200).json(others);
        } else {
          return res.status(400).json("wrong Password!");
        }
    }

    //other data
    else {
      let updatedUser;
      try {
        //check if request is for updating readingList
        if(req.body.postId){
          
          //check if post is already bookmarked
          if(req.body.bookmarked){
            updatedUser = await User.findByIdAndUpdate(req.params.id, {$pull: {readingList: req.body.postId}},
              {new: true}
            );
          }
          
          else{
            updatedUser = await User.findByIdAndUpdate(req.params.id, {$addToSet: {readingList: req.body.postId}},
              {new: true}
            );
          }
        }
        
        
        //request is for updating user information
        else{
          updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          ); 
        }
        const { password, ...others } = updatedUser._doc;
        return res.status(200).json(others);
      } catch (err) {
        return res.status(500).json(err);
      }
  }    
}catch(err) {
  return res.status(401).json({message: err});
}
});

//DELETE
router.delete("/:id", authenticateToken, async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ "userDetails.userName": user.userName });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("user not found");
    }
  } else {
    res.status(500).json("you can delete only your account");
  }
});

//Get User
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
