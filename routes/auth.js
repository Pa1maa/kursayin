const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

router.post("/signup", async (req, res)=>{  
    const { username, email, password } = req.body
    try{
        const existingUser = await User.findOne({ $or: [ {email: email }, {username: username } ] })
        if(existingUser) return res.status(400).json({ message: "User already exists", success: false })

        const newUser = new User({ username, email, password })
        await newUser.save()
        req.session.userId = newUser._id
        res.json({ message: "Sign up succesful", success: true })
    }
    catch(err){
        res.status(500).json({ message: "Server error", success: false })
    }
})

router.post("/login", async (req, res)=>{
    const { email, password } = req.body
    try{
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ message: "Invalid credentials", success: false })

        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials", success: false })

        req.session.userId = user._id
        res.json({ message: "Login successful", success: true })
    }
    catch(err){
        res.status(500).json({ message: "Server error", success: false })
    }
})

router.post("/logout", (req, res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).json({ message: "Logout failed", success: false })
        res.clearCookie("connect.sid")
        res.json({ message: "Logged out", success: true })
    })
})

router.get("/me", async (req, res)=>{
    if(!req.session.userId) return res.json({ user: null, success: false })
    const user = await User.findById(req.session.userId).select("-password")
    res.json({ user, success: true })
})

module.exports = router