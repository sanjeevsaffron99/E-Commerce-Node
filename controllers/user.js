const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** Signing Up the user and crypting his password  */
exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hash,
    });

    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    let response = { message: 'Failed SigningUp user' };

    if (error?.errors?.email?.kind === 'unique') {
      response.error = 'Not unique email';
    }
    res.status(400).json(response);
  }
};

/**Login in the user and creating an authentification token */
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(404)
        .json({ message: 'Failed Login user', error: 'Email not found' });
    } else {
      const valid = await bcrypt.compare(req.body.password, user.password);
      if (!valid) {
        res
          .status(401)
          .json({ message: 'Failed Login user', error: 'Wrong Password' });
      } else {
        // Sending a new authentificaiton token
        res.status(200).json({
          fullName: user.fullName,
          token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
            expiresIn: '24h',
          }),
        });
      }
    }
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ error: 'Unkown server error' });
  }
};