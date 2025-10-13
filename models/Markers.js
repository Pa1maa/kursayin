const mongoose = require("mongoose")

const markerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    lat: Number,
    lon: Number,
    description: String,
})

module.exports = mongoose.model("Marker", markerSchema)