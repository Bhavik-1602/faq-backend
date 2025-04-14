const nodemailer = require('nodemailer');

const sendResetPasswordEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'bhavikvala858@gmail.com', // Replace with your email
      pass: 'zxxl zlba eybz rpya',  // Replace with your email password or use OAuth2
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`; // Update with your frontend URL

  const mailOptions = {
    from: 'bhavikvala858@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetPasswordEmail;
