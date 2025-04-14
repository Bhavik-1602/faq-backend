exports.validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  next();
};

exports.validateFAQ = (req, res, next) => {
  const { category, question, answer } = req.body;
  if (!category || !question || !answer) {
    return res.status(400).json({ message: 'All FAQ fields are required' });
  }
  next();
};
