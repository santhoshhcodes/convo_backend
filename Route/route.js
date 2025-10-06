const express = require("express");
const router = express.Router();
const {
  getAll,
  create,
  deleteUser,
  login,
  postRequest,
  getRequests,
  patchRequest,
  updateProfile,
  getProfile,
  getUsersWithRequests,
  sendMessage, 
  getMessages,
  // NEW: Post routes
  createPost,
  getAllPosts,
  getUserPosts,
  toggleLike,
  addComment,
  deletePost
} = require("../Controller/controller");

// --------- User routes ----------
router.get("/getAll", getAll);
router.post("/create", create);
router.delete("/delete", deleteUser);
router.post("/login", login);

// --------- Request routes -------
router.post("/postRequest", postRequest);
router.get("/getRequests", getRequests);
router.patch("/patchRequest", patchRequest);
router.get("/getUsersWithRequests/:userId", getUsersWithRequests);

// --------- Profile routes -------
router.post("/profile", updateProfile);
router.get("/profile", getProfile);

// --------- Message routes -------
router.post("/message/send", sendMessage);
router.get("/messages/:sender/:receiver", getMessages);

// --------- NEW: Post routes -------
router.post("/posts/create", createPost);
router.get("/posts", getAllPosts);
router.get("/posts/user/:userId", getUserPosts);
router.post("/posts/like", toggleLike);
router.post("/posts/comment", addComment);
router.delete("/posts/delete", deletePost);

module.exports = router;