const express = require("express")
const router = express.Router()
const User = require("../models/User.js")
const PublicMarker = require("../models/PublicMarker.js")
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

router.get("/replys", async (req, res)=>{
    try{
        const { markerId } = req.query
        if(!markerId) return res.status(400).json({ success: false, message: "Marker ID not found" })

        const replys = await Reply.find({ markerId: markerId }).populate("userId").populate("markerId").sort({ createdAt: 1 })
        res.json({ success: true, replys: replys })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.post("/reply", isAuthenticated, async (req, res)=>{
    try{
        const { markerId, reply } = req.body

        if(!markerId || !reply){
            return res.status(400).json({ success: false, message: "Missing required fields" })
        }

        const newReply = await Reply.create({
            userId: req.user._id,
            markerId: markerId,
            reply: reply
        })

        const populated = (await newReply.populate("userId")).populate("markerId")
        res.json({ success: true, reply: populated })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.delete("/replys/:id", isAuthenticated, async (req, res)=>{
    try{
        const reply = Reply.findOne({ _id: req.params.id })

        if (!reply) {
            return res.status(404).json({ success: false, message: "Reply not found or not owned by user" })
        }

        await reply.deleteOne()

        res.json({ success: true, message: "Reply deleted" })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.delete("/deletemany", isAuthenticated, async (req, res)=>{
    try{
        const markerId = req.query.id
        if(!markerId) return res.status(400).json({ success: false, message: "Id not found" })

        const replys = await Reply.find({ markerId: markerId })
        if(!replys) return res.status(404).json({ success: false, message: "Replies not found" })

        for(const reply of replys){
            reply.deleteOne()
        }

        res.json({ success: true, message: "Replies deleted" })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

module.exports = router