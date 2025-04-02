import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    createdAt: Date,
    updatedAt: Date
})
