const express = require("express")
const router = express.Router()
const PublicMarker = require("../models/PublicMarker.js")
const User = require("../models/User.js")

async function isAuthenticated(req, res, next){
    if(!req.session.userId){
        return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    const user = await User.findById(req.session.userId)

    if(!user){
        return res.status(404).json({ success: false, message: "User not found" })
    }

    req.user = user
    next()
}

router.get("/markers", async (req, res)=>{
    try{
        const markers = await PublicMarker.find().populate("userId", "username avatarPath").sort({ createdAt: -1 })
        res.json({ success: true, markers })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.post("/marker", isAuthenticated, async (req, res)=>{
    try{
        const { lat, lng, name, comment } = req.body

        if(!lat || !lng || !name || !comment){
            res.status(400).json({ success: false, message: "Missing required fields" })
        }

        const marker = await PublicMarker.create({
            userId: req.user._id,
            lat: lat,
            lng: lng,
            name: name,
            comment: comment
        })

        const populated = await marker.populate("userId", "username avatarPath")
        res.json({ success: true, marker: populated })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.delete("/markers/:id", isAuthenticated, async (req, res)=>{
    try{
        const marker = await PublicMarker.findOne({ _id: req.params.id, userId: req.user._id })

        if(!marker){
            return res.status(404).json({ success: false, message: "Marker not found or not owned by user" })
        }

        await marker.deleteOne()

        res.json({ success: true, message: "Marker deleted" })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.get("/mymarker", isAuthenticated, async (req, res)=>{
    try{
        const markers = await PublicMarker.find({ userId: req.user._id })

        if(!markers){
            return res.status(500).json({ success: false, message: "Markers not found" })
        }

        res.json({ success: true, markers })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.get("/user/:id", async (req, res)=>{
    const user = await User.findOne({ _id: req.params.id })

    if(!user) return res.status(404).json({ success: false, message: "User not found" })
    
    res.json({ success: true, user: user })
})

router.get("/getuser", async (req, res)=>{
    try{
        const marker = await PublicMarker.findOne({ id: req.params.id })
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

module.exports = router