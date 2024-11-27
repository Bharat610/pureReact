const router = require("express").Router();
const Category =  require("../models/Category");

router.post("/", async (req, res) => {
    const newCat = new Category(req.body)
    try{
        const savedCat = await newCat.save();
        res.status(200).json(savedCat)
    }  catch(err){
        res.status(500).json(err)
    }
})

router.get("/", async (req, res) => {
    try{
        const cats = await Category.find();
        return res.status(200).json(cats)
    }  catch(err){
        return res.status(500).json({
            msg: err.message,
            stack: err.stack
        })
    }
})

//single category
router.get("/single", async (req, res) => {
    const name = req.query.name;
    try{
        const singleCategory = await Category.findOne({name: name});
        if(!singleCategory){
            return res.status(404).json("catgeory not found!")
        }
        return res.status(200).json(singleCategory)
    }  catch(err){
        return res.status(500).json({
            msg: err.message,
            stack: err.stack
        })
    }
})

module.exports = router;