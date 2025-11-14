const mongoose = require("mongoose")

const replySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    markerId: { type: mongoose.Schema.Types.ObjectId, ref: "PublicMarkers" },
    reply: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("Reply", replySchema)