const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String
  },
  role:{
    type:String,
    enuum: ['admin','user'],
    default:'user'
  }
  ,
  otp: { 
  type: String
 },
  isVerified: { 
    type: Boolean,
    default: false
  },
  // Layouts: { type: Array },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified('otp')) {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(toString(this.otp), salt);
  }
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
