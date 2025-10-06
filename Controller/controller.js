
const { User, Request, Profile, Message, Post } = require("../Model/model");

// const multer = require("multer");
// const path = require("path");

// ==================== User APIs ====================

exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const { username, password, gender, dob, email, phone } = req.body;
  if (!username || !password || !dob || !email || !gender)
    return res.status(400).json({ message: "All fields are required" });

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string" ||
    typeof gender !== "string" ||
    isNaN(Date.parse(dob))
  )
    return res.status(400).json({ message: "Invalid input types" });

  if (username.length < 3 || username.length > 30)
    return res.status(400).json({ message: "Username must be between 3 and 30 characters" });

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    return res.status(400).json({ message: "Invalid email format" });

  try {
    if (await User.findOne({ username })) return res.status(400).json({ message: "Username taken" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email registered" });

    const newUser = new User({ username, password, gender, dob, email, phone, createdAt: new Date(), updatedAt: new Date() });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "All fields required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username" });
    if (user.password !== password) return res.status(400).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== Request APIs ====================

exports.postRequest = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (from === to) return res.status(400).json({ message: "Cannot send request to yourself" });

    if (await Request.findOne({ from, to, status: "pending" }))
      return res.status(400).json({ message: "Request already sent" });

    const newReq = new Request({ from, to });
    await newReq.save();
    res.status(201).json({ message: "Request created", request: newReq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const { userId } = req.query;
    const requests = await Request.find({ to: userId }).populate("from", "username email").populate("to", "username email");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.patchRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    if (!["pending", "accepted", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const request = await Request.findByIdAndUpdate(requestId, { status, updatedAt: new Date() }, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ message: "Request updated", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsersWithRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const users = await User.find({ _id: { $ne: userId } });
    const requests = await Request.find({ $or: [{ from: userId }, { to: userId }] });

    const usersWithStatus = users.map((user) => {
      let status = "";
      const request = requests.find(
        (r) =>
          (r.from.toString() === userId && r.to.toString() === user._id.toString()) ||
          (r.to.toString() === userId && r.from.toString() === user._id.toString())
      );
      if (request) status = request.status;
      return { _id: user._id, username: user.username, img: user.img || "", status };
    });

    res.status(200).json(usersWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const doc = await User.findByIdAndDelete(id);
    if (!doc) return res.json({ message: "No document found" });

    res.json({ message: "Document deleted", doc });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// ==================== Profile APIs ====================
// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId, username, bio, image } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID required" });

   const updateData = {};

if (username && username.trim().length > 0) {
  const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: userId } });
  if (existingUser) return res.status(400).json({ message: "Username already taken" });
  updateData.username = username.trim();
}

if (bio !== undefined) updateData.bio = bio;
if (image) updateData.image = image;

updateData.updatedAt = new Date();

const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, "username bio image");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Send a text message via API (optional)
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver,username, receivername, text } = req.body;
    if (!sender || !receiver || !text || !username || !receivername)
      return res.status(400).json({ message: "All fields required" });

    const newMessage = new Message({ sender, receiver, text, username, receivername });
    await newMessage.save();

    res.status(200).json({ message: "Message sent", data: newMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    
    console.log("=== BACKEND: GET MESSAGES ===");
    console.log("Sender:", sender);
    console.log("Receiver:", receiver);
    
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ createdAt: 1 });

    console.log("Found messages:", messages.length);
    console.log("Messages:", messages);
    
    res.status(200).json(messages);
  } catch (err) {
    console.log("=== BACKEND ERROR ===");
    console.log("Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// ==================== Post APIs ====================

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { userId, username, content, image } = req.body;
    
    if (!userId || !username || !content) {
      return res.status(400).json({ message: "User ID, username, and content are required" });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: "Post content too long (max 500 characters)" });
    }

    const newPost = new Post({
      userId,
      username,
      content,
      image: image || "",
      likes: [],
      comments: []
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts with pagination
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await Post.find()
      .populate('userId', 'username image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments();

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by user ID
exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ userId })
      .populate('userId', 'username image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments({ userId });

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    
    if (!postId || !userId) {
      return res.status(400).json({ message: "Post ID and User ID are required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(userId);
    let action = '';

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      action = 'unliked';
    } else {
      // Like
      post.likes.push(userId);
      action = 'liked';
    }

    await post.save();
    res.status(200).json({ 
      message: `Post ${action} successfully`, 
      likes: post.likes.length,
      isLiked: action === 'liked'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const { postId, userId, username, comment } = req.body;
    
    if (!postId || !userId || !username || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (comment.length > 200) {
      return res.status(400).json({ message: "Comment too long (max 200 characters)" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId,
      username,
      comment,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ 
      message: "Comment added successfully", 
      comment: newComment,
      totalComments: post.comments.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    
    const post = await Post.findOne({ _id: postId, userId });
    if (!post) {
      return res.status(404).json({ message: "Post not found or unauthorized" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

