const express = require('express');
const router = express.Router();
const Blog = require('../models/Blogs'); 
const authMiddleware = (req, res, next) => {
  req.user = { id: '60c72b2f9b1d8c001f8e4a9a', role: 'admin' }; 
  next();
};


router.post('/', authMiddleware, async (req, res) => {
  try {
   
    const blogPost = new Blog({ ...req.body, author: req.user.id });

   
    await blogPost.save();

    res.status(201).json({ message: 'Blog post created successfully', blogPost });
  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;