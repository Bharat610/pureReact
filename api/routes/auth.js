const router = require("express").Router();
const User =  require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
require('dotenv').config();


//userName identifier
router.get("/username-check", async (req, res) => {
    const name = req.query.username
    try{
        const user = await User.findOne({userName: name})
        if(user) {
            return res.status(400).json("A user with that username already exists!")
        }
        return res.status(200).json("valid username!")
    }catch(err){
        res.status(500).json({message: err})
    }
})


//Register
router.post("/register", async (req, res) => {
    try{
        const emailVerify= await User.findOne({email: req.body.email})
        if(emailVerify){
            return res.status(400).json("error: A user already exists with that email id!")
        }

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(req.body.password, salt);

        const verificationToken = jwt.sign(
            {email: req.body.email},
            process.env.EMAIL_VERIFICATION_TOKEN,
            {expiresIn: "1d"}
        );

        const newUser = new User({
            name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
            password: hassedPassword,
            verificationToken: verificationToken
        })

        const user = await newUser.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth:{
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: {
                name: "PureReact",
                address: process.env.SENDER_EMAIL
            },
            to: user.email,
            subject: "Verify your Email",
            html: `
            <h1>Welcome to Pure React</h1>
            <p>Please verify your email by clicking the link below:</p>
            <a href="http://localhost:5173/verify-email?token=${verificationToken}">Verify Email</a>
            `
        };
        
        await transporter.sendMail(mailOptions)

        res.status(200).json({message:"Verification email sent!"});
    }
    catch(err){
        res.status(500).json({message: err});
    }
})

//Login
router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({userName: req.body.userName})

        if(!user){
            return res.status(400).json("Wrong credentials!")
        }

        const validated = await bcrypt.compare(req.body.password, user.password)
        if(!validated){
            return res.status(400).json("Wrong credentials!")
        }
        const generateToken = generateJwtToken(req.body.userName)
        // const accessToken = jwt.sign({userName: req.body.userName}, process.env.ACCESS_SECRET_TOKEN);
        user.accessToken = generateToken;
        await user.save()
        const {password, ...others} = user._doc;
        res.status(200).json(others)

    }
    catch(err) {
       return res.status(500).json(err)
    }
})


//Email verification route
router.get("/verify-email",  async (req, res) => {
    const token = req.query.token;
    if(!token) {
        return res.status(400).json({message: "Token missing"})
    }
    try{
       const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN)

            const user = await User.findOneAndUpdate(
                { email: decoded.email, verificationToken: token },
                { isVerified: true, verificationToken: null },
                { new: true }
            );   

            if (!user) {
                return res.status(400).json({ message: "Invalid or expired token!" });
            }

            const generateToken = generateJwtToken(user.userName);
            user.accessToken = generateToken;
            await user.save()
            const {password, ...others} = user._doc;
            res.status(200).json(others);

    }catch(err) {
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
});

//jwt token generation function
function generateJwtToken(username) {
    try{
        const accessToken = jwt.sign({userName: username}, process.env.ACCESS_SECRET_TOKEN);
        return accessToken;
    }catch(err) {
        throw new Error("Token generation failed");
    }
}

//jwt verification function
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Token is missing"})
    }
    
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if(err) {
            return res.status(403).json({message: "Invalid token"});
        }
        req.user = user;
        next();
    })
}



//forgot password -- send email
router.post('/reset-link', async(req, res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user) {
            res.status(400).json("User does not exist!")
        }
        const verificationToken = jwt.sign(
            {email: req.body.email, validate: true},
            process.env.PASSWORD_RESET_VERIFICATION_TOKEN,
            {expiresIn: "15m"}
        );

        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth:{
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: {
                name: "PureReact",
                address: process.env.SENDER_EMAIL
            },
            to: user.email,
            subject: "Reset your password",
            html: `
            <p>You can reset your password by clicking on the link below:</p>
            <a href="http://localhost:5173/password-reset?token=${verificationToken}">Change Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions)

        res.status(200).json("Password reset email sent successfully!");
    }catch(err){
        res.status(500).json("Something went wrong!")
    }
})


//reset password
router.put('/password-reset', async(req, res) => {
    const reset_token = req.query.token;

    if(!reset_token) {
        return res.status(400).json({message: "Token missing"})
    }
    try{
        const decoded = jwt.verify(reset_token, process.env.PASSWORD_RESET_VERIFICATION_TOKEN)

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(req.body.password, salt);

             const user = await User.findOneAndUpdate(
                 { email: decoded.email },
                 { password: hassedPassword },
                 { new: true }
             );   
 
             if (!user) {
                 return res.status(400).json({ message: "Invalid or expired token!" });
             }

             decoded.validate = false;
             await user.save();

             res.status(200).json("password updated successfully!");

     }catch(err) {
         return res.status(500).json({ message: "Something went wrong!" });
     }
})


module.exports = {router, authenticateToken};