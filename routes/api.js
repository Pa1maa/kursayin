const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs").promises
const bcrypt = require("bcrypt")
const multer =  require("multer")
const User = require("../models/User.js")

const UPLOAD_DIR = path.join(__dirname, "..", "uploads")
const storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, UPLOAD_DIR),
    filename: (req, file, cb)=> {
        const ext = path.extname(file.originalname) || ".png"
        cb(null, `avatar-${Date.now()}${ext}`)
    }
})

const upload = multer({ storage })

async function authRequired(req, res, next) {
    if(!req.session.userId) return res.status(401).json({ error: "Not authenticated" })

    const user = await User.findById(req.session.userId)
    if(!user) return res.status(404).json({ error: "User not found" })

    req.user = user
    next()
}

router.get("/me", authRequired, (req, res)=>{
    const { username, email, age, gender, avatarPath } = req.user
    res.json({ username, email, age, gender, avatarPath })
})

router.get("/update-username", authRequired, async (req, res)=>{
    const { username } = req.body
    if(!username) return res.status(400).json({ error: "Username required" })
    
    req.user.username = username
    await req.user.save()
    res.json({ ok: true, username })
})

router.get("/update-email", authRequired, async (req, res)=>{
    const { email } = req.body
    if(!email) return res.status(400).json({ error: "Email required" })

    req.user.email = email
    await req.user.save()
    res.json({ ok: true, email })
})

router.get("/update-age", authRequired, async (req, res)=>{
    const { age } = req.body
    if(!age) return res.status(400).json({ error: "Age required" })

    req.user.age = age
    await req.user.save()
    res.json({ ok: true, age })
})

router.get("/update-gender", authRequired, async (req, res)=>{
    const { gender } = req.body
    if(!gender) return res.status(400).json({ error: "Gender required" })

    req.user.gender = gender
    await req.user.save()
    res.json({ ok: true, gender })
})

router.get("/update-password", authRequired, async (req, res)=>{
    const { currentPassword, newPassword } = req.body
    if(!newPassword) return res.status(400).json({ error: "New pasword required" })
    
    const ok = await bcrypt.compare(currentPassword || "", req.user.password)
    if(!ok) return res.status(403).json({ error: "Current password incorrect" })

    req.user.password = newPassword
    await req.user.save()
    res.json({ ok: true })
})

router.get("/update-avatar", authRequired, upload.single("avatar"), async (req, res)=>{
    if(!req.file) return res.status(400).json({ error: "File required" })

    if(req.user.avatarPath){
        const oldAvatarPath = path.join(__dirname, "..", req.user.avatarPath.replace(/^[/\\]+/, ""))
        
        if(fs.existsSync(oldAvatarPath)){
            fs.unlink(oldAvatarPath, err=>{
                if(err) console.error("Faled to mdelete old avatar: ", err)
            })
        }
    }

    req.user.avatarPath = `/uploads/${req.file.filename}`
    await req.user.save()
    res.json({ ok: true, avatarPath: req.user.avatarPath })
})

module.exports = router