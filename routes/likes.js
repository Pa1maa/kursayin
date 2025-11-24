const express = require("express")
const router = express.Router()
const PublicMarker = require("../models/PublicMarker.js")
const User  = require("../models/User.js")

async function authRequired(req, res, next){
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

router.post("/like/:id", authRequired, async (req, res)=>{
    try{
        const markerId = req.params.id
        const userId = req.user._id
        if(!markerId) return res.status(400).json({ success: false, message: "Id not found" })

        const marker = await PublicMarker.findById(markerId)
        if(!marker) return res.status(404).json({ success: false, message: "Marker not found" })

        const liked = marker.like.includes(userId)

        if(liked){
            marker.like = marker.like.filter(id => !id.equals(userId))
        }
        else{
            marker.dislike = marker.dislike.filter(id => !id.equals(userId))
            marker.like.push(userId)
        }

        await marker.save()
        res.json({ success: true, likes: marker.like.length, dislikes: marker.dislike.length })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.post("/dislike/:id", authRequired, async (req, res)=>{
    try{
        const markerId = req.params.id
        const userId = req.user._id
        if(!markerId) return res.status(400).json({ success: true, message: "Id not found" })

        const marker = await PublicMarker.findById(markerId)
        if(!marker) return res.status(404).json({ success: false, message: "Marker not found" })

        const disliked = marker.dislike.includes(userId)

        if(disliked){
            marker.dislike = marker.dislike.filter(id => !id.equals(userId))
        }
        else{
            marker.like = marker.like.filter(id => !id.equals(userId))
            marker.dislike.push(userId)
        }

        await marker.save()
        res.json({ success: true, likes: marker.like.length, dislikes: marker.dislike.length })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.get("/all", async (req, res)=>{
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ success: false, message: "Id not found" });

        const marker = await PublicMarker.findById(id);
        if (!marker) return res.status(404).json({ success: false, message: "Marker not found" });

        res.json({ success: true, likes: marker.like.length, dislikes: marker.dislike.length });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

router.get("/liked", authRequired, async (req, res)=>{
    try{
        const id = req.query.id;
        const userId = req.user._id
        if (!id) return res.status(400).json({ success: false, message: "Id not found" });

        const marker = await PublicMarker.findById(id);
        if (!marker) return res.status(404).json({ success: false, message: "Marker not found" });

        const liked = marker.like.includes(userId)

        res.json({ success: true, condition: liked })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

router.get("/disliked", authRequired, async (req, res)=>{
    try{
        const id = req.query.id;
        const userId = req.user._id
        if (!id) return res.status(400).json({ success: false, message: "Id not found" });

        const marker = await PublicMarker.findById(id);
        if (!marker) return res.status(404).json({ success: false, message: "Marker not found" });

        const disliked = marker.dislike.includes(userId)

        res.json({ success: true, condition: disliked })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ success: false, message: err.message })
    }
})

module.exports = router