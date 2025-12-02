const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const fs = require("fs")
const multer = require("multer")
const cors = require("cors")
const passport = require("passport")
const authRoutes = require("./routes/auth.js")
const markerRoutes = require("./routes/markers.js")
const publicMarkerRoutes = require("./routes/publicMarkers.js")
const userRoutes = require("./routes/user.js")
const replyRoutes = require("./routes/reply.js")
const likeRoutes = require("./routes/likes.js")
const apiRoutes = require("./routes/api.js")

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
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));

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
app.use("/api", apiRoutes)

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "main", "index.html"))
})

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDb connected")).catch(err => console.log("MongoDB error: ", err))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))