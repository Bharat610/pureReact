const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const {router, authenticateToken} = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const user = require("./models/User")
const Posts = require("./models/Post")

// const cors = require('cors');
// app.use(cors());

dotenv.config();
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/images", express.static(path.join(__dirname, "/images")))

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("don't know shit thats going on here");
  }

  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "images")
  //   },filename: (req,file, cb) => {
  //     cb(null, req.body.name)
  //   }
  // })

  // const upload = multer({storage: storage})
  // app.post("/api/upload", upload.single("file"), (req,res) => {
  //   res.status(200).json("File has been uploaded")
  // })


  //cloudinary config
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  app.post("/api/upload", upload.single('file'), async (req, res) => {
  try{
    const fileBuffer = req.file.buffer;

    cloudinary.uploader.upload_stream({asset_folder: 'pureReact-folder', use_filename: true}, (error, result) => {

      if(error){
        console.error('Upload to Cloudinary failed:', error);
        return res.status(500).json({ error: 'Cloudinary upload failed' });
      }

       res.status(200).json({url: result.secure_url});

    }).end(fileBuffer)

  }catch(err){
    console.log(err)
    return res.status(500).json(err)
  }
})

  // async function cloudUpload() {
  //   const uploadResult = await cloudinary.uploader
  //      .upload(
  //          './images/1728200571875two-lamb-gyros-with-feta-cheese-tzatziki-sauce.jpg', {
  //           asset_folder: 'pureReact-folder',
  //          }
  //      )
  //      .catch((error) => {
  //          console.log(error);
  //      });
    
  //   console.log(uploadResult);
  // } 
  // cloudUpload()



//   // Folder containing existing images
// const imageFolder = path.join(__dirname, './images'); 

// // Get all image files from the folder
// const files = fs.readdirSync(imageFolder);

// files.forEach(async (file) => {
//   if (/\.(png|jpg|jpeg|gif)$/i.test(file)) { 
//     const filePath = path.join(imageFolder, file);
//     console.log(`Uploading: ${filePath}`);

//     try {
//       const result = await cloudinary.uploader.upload(filePath);
//       console.log(`Uploaded: ${result.secure_url}`);
//     } catch (err) {
//       console.error(`Failed to upload ${file}:`, err);
//     }

//   }
// });


app.use("/api/auth", router)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)

app.listen("5000", () => {
    console.log("backend is running awesome")
})




// async function updateUserSchema() {
//   try{
//     const res = await user.updateMany({name: {$exists: false}}, {$set: {name: ""}})
//   }catch(err){
//     console.log(err.message)
//   }
// }

// async function updateUserPhoto() {
//   try{
//     const res = await user.updateMany({profilePicture: {$eq: ""}}, {$set: {profilePicture: "userDefault.png"}})
//   }catch(err){
//     console.log(err)
//   }
// }

// async function postDelete() {
//   try{
//     const res = await posts.deleteMany({})
//   }catch(err){
//     console.log(err)
//   }
// }


// async function postLikes() {
//   try{
//     const posts = await Posts.updateMany({}, {$set: {likes: []}})
//   }catch(err){
//     console.log(err.message)
//   }
// }

// postLikes();


// async function updateLikesCount() {
//   try {
//     const posts = await Posts.find(); 
//     const updates = posts.map(post => 
//       Posts.updateOne(
//         { _id: post._id },
//         { $set: { likesCount: post.likes.length } } 
//       )
//     );
//     await Promise.all(updates); 
//     console.log("Likes count updated successfully");
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// updateLikesCount();

// async function postComments() {
//   try{
//     const posts = await Posts.updateMany({}, {$set: {comments: []}})
//   }catch(err) {
//     console.log(err.message)
//   }
// }

// postComments();

// postDelete();




// async function createTTLIndex() {
//   try {
//       await user.collection.createIndex(
//           { createdAt: 1 },
//           {
//               expireAfterSeconds: 86400, // 24 hours
//               partialFilterExpression: { isVerified: false }
//           }
//       );
//       console.log('TTL index created successfully.');
//   } catch (error) {
//       console.error('Error creating TTL index:', error);
//   }
// }

// createTTLIndex();
