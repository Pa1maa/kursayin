const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDb connected")).catch(err => console.log("MongoDB error: ", err))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))