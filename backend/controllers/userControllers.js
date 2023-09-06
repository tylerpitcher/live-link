const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const validators = require('../utils/has');
const { getRedisKey, setRedisKey } = require('../utils/redis');

function generateToken(name, timestamp) {
  return jwt.sign({ name, timestamp }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

function isPassword(pass1, pass2) {
  if (!validators.hasPasswordLength(pass1)) return [false, 'Passwords must be at least 8 characters.'];
  if (!validators.hasUppercase(pass1)) return [false, 'Passwords require at least 1 uppercase character.'];
  if (!validators.hasLowercase(pass1)) return [false, 'Passwords require at least 1 lowercase character.'];
  if (!validators.hasNum(pass1)) return [false, 'Passwords require at least 1 number.'];
  if (!validators.hasSpecialChar(pass1)) return [false, 'Passwords require at least 1 special character (!, @, #, $, or %).'];
  if (pass1 !== pass2) return [false, 'Passwords do not match.'];

  return [true, pass2];
}

async function registerUser(req, res) {
  const { name, password1, password2 } = req.body;
  if (!name || !password1 || !password2) return res.sendStatus(400);

  if (name?.length < 2) return res.status(400).json({
    code: 1,
    msg: 'Name must be at least 2 characters.',
  });

  const [valid, msg] = isPassword(password1, password2);
  if (!valid) return res.status(400).json({ code: 2, msg });

  const exists = await getRedisKey(`user:${name}`);
  if (exists) return res.status(409).json({
    code: 1,
    msg: 'Name already taken.',
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password1, salt);

  const timestamp = Date.now();
  await setRedisKey(`user:${name}`, {
    timestamp,
    name,
    password: hash,
    ownedRooms: [],
    guestRooms: [],
  });

  return res.status(201).json({
    name,
    token: generateToken(`user:${name}`, timestamp),
  });
}

async function loginUser(req, res) {
  const { name, password } = req.body;
  if (!name || !password) return res.sendStatus(401);

  if (name?.length < 2) return res.status(401).json({
    code: 1,
    msg: 'Name must be at least 2 characters.',
  });

  const [valid, msg] = isPassword(password, password);
  if (!valid) return res.status(401).json({ code: 2, msg });
  
  const user = await getRedisKey(`user:${name}`);
  const match = await bcrypt.compare(password, user?.password || '');
  
  if (!match) return res.sendStatus(401);

  return res.status(200).json({
    name,
    token: generateToken(`user:${name}`, user.timestamp),
  });
}

module.exports = {
  registerUser,
  loginUser,
};
