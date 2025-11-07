const mongoose = require("mongoose")

const PublicMarkerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, res: "User" },
    lat: { type: Number, required: true },
    lng: {type: Number, required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("PublicMarkers", PublicMarkerSchema)