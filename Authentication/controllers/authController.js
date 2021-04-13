const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
  const { email, username, password } = req.body;

  // check if all fields are present
  if (!email || !username || !password) {
    return res.status(400).send("Please provide all fields.");
  }

  //check if username/email is already in database
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("Email already exists.");
  }

  //hashing of password
  const hashedPassword = await bcrypt.hash(password, 12);
  //create user
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });
  //generate token
  const token = jwt.sign({id: user._id}, "123456789", {expiresIn: "1h" });
  //return response

  res.status(201).json({ token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  //check if user is in the database
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid credentials.");
  }
  //compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid credentials");
  }
  //generate token
  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  //return response
  res.status(200).json({ token });

};

//AUTHORIZATION(day2)

const verifyToken =(req,res,next) => {
  const token = req.headers["authorization"];
  if (!token){
    return res.status(401).json({message: "Not authorized."});
  }
  // console.log(token);
  // console.log  ("Token verified");

  token = token.split(" ")[1];
  try {
    let user =jwt.verify(token,"12345678");
    req.user = user.id;
    return next();
  } catch (error) {
    res.status(401).json({message: "Invalid token"})
  }

  next();
};

module.exports = {
  register,
  login,
  verifyToken,
};
