const express = require('express');
const {
  signup,
  login,
  updatePassword,
  verifyTokenExpired,
  getBalance,
  forgotPassword,
} = require('../controllers/user');

const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/updatePassword', decode, updatePassword);
router.get('/verifyToken', verifyTokenExpired);
router.get('/balance', decode, getBalance);
router.put('/forgotPassword', forgotPassword);

module.exports = router;
