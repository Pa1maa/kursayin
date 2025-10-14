const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")
const session = require("express-session")
const MongoStore = require("connect-mongo")

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUnitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions"
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

const authRoutes = require("./routes/auth.js")
app.use("/auth", authRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDb connected")).catch(err => console.log("MongoDB error: ", err))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))