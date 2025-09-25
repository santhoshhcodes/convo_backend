const { User, Request, Profile  } = require('../Model/model'); 



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
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  const { username, password, gender, dob, email, phone } = req.body;
  if (!username || !password || !dob || !email || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    typeof username !== "string" || typeof password !== "string" ||
    typeof email !== "string" || typeof gender !== "string" ||
    isNaN(Date.parse(dob))
  ) {
    return res.status(400).json({ message: "Invalid input types" });
  }
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ message: "Username must be between 3 and 30 characters" });
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const newUser = new User({ username, password, gender, dob, email, phone, createdAt: new Date(), updatedAt: new Date() });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }
    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.postRequest = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (from === to) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const exists = await Request.findOne({ from, to, status: 'pending' });
    if (exists) {
      return res.status(400).json({ message: "Request already sent" });
    }

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

    const requests = await Request.find({ to: userId })
      .populate("from", "username email") 
      .populate("to", "username email");   

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.patchRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findByIdAndUpdate(
      requestId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request updated", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const {id} = req.body; 
    const doc = await Model.findByIdAndDelete(id);
    if(!doc){
      return res.json({Message:'No document found'})
    }  
    return res.json({Message:'Document deleted', doc})
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.profile = async (req, res) => {
  const { userId, bio, image } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newProfile = new profileSchema({ userId, bio, image, createdAt: new Date(), updatedAt: new Date() });
    await newProfile.save();
    return res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

