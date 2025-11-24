const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const fs = require("fs")
const multer = require("multer")
const bcrypt = require("bcrypt")
const cors = require("cors")
const User = require("./models/User.js")
const passport = require("passport")
const authRoutes = require("./routes/auth.js")
const markerRoutes = require("./routes/markers.js")
const publicMarkerRoutes = require("./routes/publicMarkers.js")
const userRoutes = require("./routes/user.js")
const replyRoutes = require("./routes/reply.js")
const likeRoutes = require("./routes/likes.js")

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads"

if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR)

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".png"
        const filename = `avatar-${Date.now()}${ext}`
        cb(null, filename)
    }
})
const upload = multer({ storage })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)))

app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions"
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

app.use(passport.initialize())
app.use(passport.session())

async function authRequired(req, res, next){
    if(!req.session.userId){
        return res.status(401).json({ error: "Not authenticated" })
    }
    const user = await User.findById(req.session.userId)
    if(!user){
        return res.status(404).json({ error: "User not found" })
    }

    req.user = user
    next()
}

app.get("/api/me", authRequired, async (req, res) => {
    const { username, email, age, gender, avatarPath } = req.user
    res.json({ username, email, age, gender, avatarPath })
})

app.post("/api/update-username", authRequired, async (req, res) => {
    const { username } = req.body
    if (!username) return res.status(400).json({ error: "username required" })
    req.user.username = username
    await req.user.save()
    res.json({ ok: true, username })
})

app.post("/api/update-email", authRequired, async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: "email required" })
    req.user.email = email
    await req.user.save()
    res.json({ ok: true, email })
})

app.post("/api/update-age", authRequired, async (req, res) => {
    const { age } = req.body
    if(!age) return res.status(400).json({ error: "age required" })
    req.user.age = age
    await req.user.save()
    res.json({ ok: true, age })
})

app.post("/api/update-password", authRequired, async (req, res) => {
    const { currentPassword, newPassword } = req.body
    if(!newPassword) return res.status(400).json({ error: "new password required" })
    const ok = await bcrypt.compare(currentPassword || "", req.user.password)
    if(!ok) return res.status(403).json({ error: "current password incorrect" })
    req.user.password = newPassword
    await req.user.save()
    res.json({ ok: true })
})

app.post("/api/update-gender", authRequired, async (req, res) => {
    const { gender } = req.body
    req.user.gender = gender || "Not defined"
    await req.user.save()
    res.json({ ok: true, gender: req.user.gender })
})

app.post("/api/update-avatar", authRequired, upload.single("avatar"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "file required" })

    if(req.user.avatarPath){
        const oldAvatarPath = path.join(__dirname, req.user.avatarPath)

        if(fs.existsSync(oldAvatarPath)){
            fs.unlink(oldAvatarPath, err => {
                if(err){
                    console.error("Failed to delete old avatar: ", err)
                }
            })
        }
    }

    req.user.avatarPath = `/uploads/${req.file.filename}`
    await req.user.save()
    res.json({ ok: true, avatarPath: req.user.avatarPath })
})

app.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "auth", "login.html"))
})

app.get("/signup", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "auth", "signup.html"))
})

app.get("/me", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "account", "acc.html"))
})

app.get("/user", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "publicAccount", "pacc.html"))
})

app.use("/auth", authRoutes)
app.use("/mark", markerRoutes)
app.use("/public", publicMarkerRoutes)
app.use("/users", userRoutes)
app.use("/reply", replyRoutes)
app.use("/likes", likeRoutes)

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "main", "index.html"))
})

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDb connected")).catch(err => console.log("MongoDB error: ", err))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))