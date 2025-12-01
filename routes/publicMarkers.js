const express = require("express")
const router = express.Router()
const PublicMarker = require("../models/PublicMarker.js")
const UserMarker = require("../models/UserMarker.js")
const User = require("../models/User.js")
const Reply = require("../models/Reply.js")

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

router.delete("/markers", isAuthenticated, async (req, res)=>{
    try{
        const marker = await PublicMarker.findById(req.query.id)

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

router.get("/search", async (req, res)=>{
    try{
        const search = req.query.name || ""
        if(!search) return res.status(400).json({ success: false, message: "Missing required field" })

        const markers = await PublicMarker.find({ name: { $regex: search, $options: "i" } })
        if(!markers) return res.json({ success: false, message: "No markers found" })

        res.json({ success: true, markers: markers })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.delete("/deletemany", isAuthenticated, async (req, res)=>{
    try{
        const userId = req.user._id
        if(!userId) return res.status(400).json({ success: false, message: "User id not provided" })

        const markers = await PublicMarker.find({ userId: userId })
        if(!markers) return res.status(404).json({ success: false, message: "Markers not found" })

        for(const marker of markers){
            const replies = await Reply.find({ markerId: marker._id })
            if(!replies) return res.status(400).json({ success: false, message: "Replies not found" })

            for(const reply of replies){
                await reply.deleteOne()
            }

            await marker.deleteOne()
        }

        const replies = await Reply.find({ userId: userId })
        if(!replies) return res.status(400).json({ success: false, message: "Replies not found" })

        for(const reply of replies){
            await reply.deleteOne()
        }

        const userMarkers = await UserMarker.find({ userId: userId })
        if(!userMarkers) return res.status(400).json({ success: false, message: "Markers not found" })

        for(const mar of userMarkers){
            await mar.deleteOne()
        }

        res.json({ success: true, message: "Markers deleted" })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

module.exports = router