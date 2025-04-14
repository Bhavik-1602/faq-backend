// backend/routes/faqRoutes.js
const express = require("express");
const router = express.Router();
const Faq = require("../models/Faq");

// POST route to add FAQ
router.post("/", async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFaq = new Faq({ question, answer });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: "Error adding FAQ", error });
  }
});

// GET all FAQs
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQs", error });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const faqs = await Faq.findById(req.params.id);
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQs", error });
  }
});


// DELETE FAQ by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error });
  }
});


// PUT route to update FAQ
router.put("/:id", async (req, res) => {
  const { question, answer } = req.body;
  try {
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true } // returns updated doc
    );
    res.json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ", error });
  }
});

module.exports = router;
