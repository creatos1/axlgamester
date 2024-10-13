const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, nickname, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El correo ya está en uso' });
    }

    user = new User({ email, nickname, password });
    await user.save();

    res.status(201).json({ msg: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
});

module.exports = router;
