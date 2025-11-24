const mongoose = require("mongoose")

const publicMarkerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lat: { type: Number, required: true },
    lng: {type: Number, required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    like: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    dislike: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("PublicMarkers", publicMarkerSchema)