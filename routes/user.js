const express = require("express")
const router = express.Router()
const User = require("../models/User.js")
const PublicMarker = require("../models/PublicMarker.js")

async function getUser(req, res, next){
    const username = req.body.username
    if(!username) return res.status(400).json({ success: false, message: "Username is not provided" })

    try{
        const user = await User.findOne({ username: username })
        if(!user) return res.status(404).json({ success: false, message: "User not found" })

        req.user = user
        next()
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
}

router.get("/getuser", async (req, res)=>{
    try{
        const marker = await PublicMarker.findOne({ _id: req.query.id })
        const comUser = await User.findOne({ _id: marker.userId })

        if(!comUser){
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.json({ success: true, user: comUser })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.post("/user", getUser, (req, res)=>{
    res.json({ success: true, user: req.user })
})

module.exports = router