const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  bio: { type: String, default: '' },
  image: { type: String, default: '' },
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

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'convo', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'convo', required: true },
  username: { type: String, required: true },
  receivername: { type: String, required: true },
  text: { type: String, required: true },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  }
}, { timestamps: true });

// Post Schema
const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'convo', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'convo' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'convo', required: true },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = model('convo', userSchema);
const Request = model('Request', requestSchema);
const Profile = model('Profile', profileSchema);
const Message = model('Message', messageSchema);
const Post = model('Post', postSchema);

module.exports = { User, Request, Profile, Message, Post };
