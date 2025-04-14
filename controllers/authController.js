const crypto = require('crypto');
const sendOTPEmail = require('../utils/sendOTPEmail');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendResetPasswordEmail = require('../utils/sendResetPasswordEmail '); // This is your utility to send the reset email

exports.registerUser = async (req, res) => {


  try {

    const { name, email, password } = req.body; 
    if( !name || !email || !password) {
      return res.status(400).json({success:false,message:"All Fielss are Required"})
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success:true, message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 1 * 60 * 1000; // 1 minit minutes

    const user = new User({
      name,
      email,
      password: hashed,
      otp,
      otpExpires,
      // verificationToken,
      passwordHistory: [hashed],
     
   
    });

    await user.save();

    await sendOTPEmail(email, otp);
    res.status(201).json({ success:true, message: 'OTP sent to your email',User });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success:false, message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.json({ message: 'OTP resent to your email' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const user = await User.findOne({ verificationToken: token });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     user.emailVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.json({ message: 'Email verified successfully!' });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




// Forgot Password route handler
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token
  
    const resetToken = crypto.randomBytes(32).toString('hex');
const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

user.resetToken = resetToken;
user.resetTokenExpires = tokenExpiry;
await user.save(); // Generate a random token
    

    user.resetToken = resetToken;
    //  
    await user.save();

    // Send the reset password email with the token (you can include a link to the frontend reset page)
    await sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password route handler
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Find user by reset token and check if the token has expired
    const user = await User.findOne({
      resetToken,
      resetTokenExpires: { $gt: Date.now() }, // Check if token is still valid
      
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save the new password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
