const express = require("express")
const router = express.Router()
const UserMarker = require("../models/UserMarker.js")
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

router.get("/markers", isAuthenticated, async (req, res)=>{
    try{
        const markers = await UserMarker.find({ userId: req.user._id })
        res.json({ success: true, markers })
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
})

router.post("/marker", isAuthenticated, async (req, res)=>{
    try{
        const { lat, lng, name } = req.body
        if(!lat || !lng || !name){
            res.status(400).json({ success: false, message: "Missing data" })
        }

        const marker = await UserMarker.create({
            userId: req.user._id,
            lat,
            lng,
            name
        })
        res.json({ success: true, marker })
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
})

router.delete("/markers/:id", isAuthenticated, async (req, res)=>{
    try{
        const result = await UserMarker.deleteOne({ _id: req.params.id, userId: req.user._id })
        if(result.deletedCount === 0){
            res.status(404).json({ success: false, message: "Marker not found" })
        }
        
        res.json({ success: true })
    }
    catch(err){
        res.status(500).json({ success: false, message: err.message })
    }
})

module.exports = router