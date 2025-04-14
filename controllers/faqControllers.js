const FAQ = require('../models/FAQ.js');
const FAQCategory = require('../models/FAQCategory.js');

exports.addCategory = async (req, res) => {
  const { name } = req.body;
  const category = new FAQCategory({ name });
  await category.save();
  res.status(201).json(category);
};

exports.addFAQ = async (req, res) => {
  const { category, question, answer } = req.body;
  const faq = new FAQ({ category, question, answer });
  await faq.save();
  res.status(201).json(faq);
};

exports.listFAQs = async (req, res) =>  {
  const faqs = await FAQ.find().populate('category', 'name');
  res.json(faqs);
};
