// const nodemailer = require('nodemailer');

// const sendVerificationEmail = async (email, token) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const verificationURL = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Verify your email',
//     html: `<p>Click <a href="${verificationURL}">here</a> to verify your email.</p>`
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendVerificationEmail;





const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Email Verification',
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;
