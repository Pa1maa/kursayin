const mongoose = require("mongoose")
const { type } = require("os")

const userMarkerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("UserMarker", userMarkerSchema)