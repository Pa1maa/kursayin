const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

router.post("/signup", async (req, res)=>{
    const { username, email, password } = req.body
    try{
        const existingUser = await User.findOne({ email })
        if(existingUser) return res.status(400).json({ error: "User already exists" })

        const newUser = new User({ username, email, password })
        await newUser.save()
        req.session.userId = newUser._id
        res.json({ message: "Sign up succesful" })
    }
    catch(err){
        res.status(500).json({ error: "Server error" })
    }
})

router.post("/login", async (req, res)=>{
    const { email, password } = req.body
    try{
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ error: "Invalid credentials" })

        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.status(400).json({ error: "Invalid credentials" })

        req.session.userId = user._id
        res.json({ message: "Login successful" })
    }
    catch(err){
        res.status(500).json({ message: "Srever error" })
    }
})

router.post("logout", (req, res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).json({ error: "Logout failed" })
        res.clearCookie("connect.sid")
        res.json({ message: "Logged out" })
    })
})

router.get("/me", async (req, res)=>{
    if(!res.session.userId) return res.status(401).json({ error: "Not logged in" })
    const user = await User.findById(req.session.userId).select("-password")
    res.json(user)
})

module.exports = router