//authController.js
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const createJWT = require('../utils/createJWT');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exists' });
    }
    const generated_otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = generated_otp;
    console.log(user.otp)
    await user.save();
    await sendEmail(email, 'Verify your email', `Your OTP code is ${generated_otp}`);
    return res.status(200).json({ otpFlag: true, msg: `OTP has been sent to your email : '${email}' ` });
  } catch (err) {
    return res.status(500).send('Server error');
  }
}

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ msg: 'User already exists' });
    }
    user = new User({ username, email, password });
    await user.save();
    return await sendOTP(req, res);

  } catch (err) {
    res.status(500).send('Server error');
  }
};

const verifyEmail = async (req, res) => {
  const { email, otp, passwordResetFlag } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(toString(otp), user.otp)

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ passwordResetFlag, msg: 'Email verified successfully' });
  } catch (err) {
    return res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'email is not registered' });
    }

    if (!user.isVerified) {
      return await sendOTP(req, res);
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ msg: 'Incorrect password' });
    }

    // Check if the selected role matches the user's role
    if (role && user.role !== role) {
      return res.status(403).json({ msg: `Invalid credentials for ${role} login` });
    }

    const token = createJWT(user);
    console.log("Generated Token:", token); 
    return res.status(200).json({ token, msg: "Token sent" });

  } catch (err) {
    return res.status(500).send('Server error');
  }
}

const passwordReset = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'email is not registered' });
    }
    user.password = password;
    await user.save();
    return res.status(200).json({ msg: 'Password updated Successfully' });

  } catch (err) {
    res.status(500).send('Server error');
  }
}

const saveLayout = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json({ msg: 'Layout Saved Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}

const getUserProfile = async (req, res) =>{
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const fetchUsers = async (req,res)=>{
  try{
    const user = await User.find({});
    if(!user || user.length === 0)
      return res.status(404).json({ msg: 'No users found' });
    
    else
      return res.status(200).json({msg:'Users fetched successfully'},user);
    
  }catch(err){
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const deleteUser = async (req,res) => {
  try{
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if(!user)
      return res.status(404).json({msg:'User not found'});
    else 
      return res.status(200).json({msg:'User deleted successfully'});
  }catch(err){
    return res.status(500).json({msg:'Server Error'});
  }
}


module.exports = { sendOTP, register, verifyEmail, login, passwordReset, saveLayout, getUserProfile ,deleteUser,fetchUsers};
