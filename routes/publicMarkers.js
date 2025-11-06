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

//steic sharunakel