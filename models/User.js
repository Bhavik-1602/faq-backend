const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
  type:String,
  require:true
  },
  email: {
  type: String,
  unique: true, 
},
  password:{
   type: String,
  } ,
  isVerified:{
    type:Boolean,
    default:false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetToken:{
    type:String
  },
  resetTokenExpires:{
type:Date
  },
  verificationToken: String,
  otp: 
  { type: String 

  },
otpExpires: 
{ type: Date 
  
},

  passwordHistory: [String],


},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
