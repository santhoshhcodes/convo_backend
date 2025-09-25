const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const requestSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'convo', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'convo', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

const profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'convo', required: true },
  bio: { type: String },
  image: { type: String }
}, { timestamps: true });

const User = model("convo", userSchema);
const Request = model("Request", requestSchema);
const Profile = model("Profile", profileSchema);


module.exports = { User, Request, Profile };
