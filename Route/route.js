const express = require('express');
const { Router } = express;
const router = Router();
const {
  getAll,
  create,
  deleteUser,
  login,
  postRequest,
  getRequests,
  patchRequest,
  profile
} = require('../Controller/controller');

router.get('/getAll', getAll);
router.post('/create', create);
router.delete('/delete', deleteUser);
router.post('/login', login);
router.post('/postRequest', postRequest);
router.get('/getRequests', getRequests);
router.patch('/patchRequest', patchRequest);
router.post('/profile', profile);

module.exports = router;
