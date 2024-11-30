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
    console.log("MongoDB Connected");
  }


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


app.use("/api/auth", router)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)

app.listen("5000", () => {
    console.log("backend is running awesome")
})




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
