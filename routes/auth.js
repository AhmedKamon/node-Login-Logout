const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
//REGISTER
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      JSON.stringify(req.body.password),
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const saverUser = await newUser.save();
    res.status(201).json(saverUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(500).json(' username Wrong Credentials');
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const orginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    orginalPassword !== req.body.password &&
      res.status(500).json(' pass  Wrong Credentials');

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
