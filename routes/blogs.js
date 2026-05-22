const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/Blogs'); 

const authMiddleware = (req, res, next) => {
  req.user = { id: '60c72b2f9b1d8c001f8e4a9a', role: 'admin' }; 
  next();
};

const defaultBlogs = [
  {
    title: "Field Diary: 30 Days in Gaza",
    slug: "field-diary-30-days-in-gaza",
    excerpt: "Our team shares raw, unfiltered accounts from the ground as we help families rebuild after devastating attacks.",
    content: "Humanitarian conditions in Gaza are extremely critical. Our ground teams have spent 30 days distributing heavy thermal shelter kits, food, and clean water. Here is a raw account of what we witness...",
    author: "Sarah Ahmed", // We will output author name directly for fallback ease
    tags: ["Field Diaries", "Gaza", "Emergency"],
    featuredImage: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2026-05-15T12:00:00Z"),
    updatedAt: new Date("2026-05-15T12:00:00Z")
  },
  {
    title: "Donor Spotlight: The Johnson Family's 10-Year Journey",
    slug: "donor-spotlight-johnson-family",
    excerpt: "How a small monthly donation became a lifeline for hundreds of families across three continents.",
    content: "We sit down with the Johnson family to talk about why they chose monthly giving, and how their steady support has funded long-term clean water wells and clinic supplies.",
    author: "Michael Torres",
    tags: ["Donor Spotlights", "Monthly Support"],
    featuredImage: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2026-05-12T12:00:00Z"),
    updatedAt: new Date("2026-05-12T12:00:00Z")
  },
  {
    title: "Afghanistan Winter Update: Reaching 5,000 Children",
    slug: "afghanistan-winter-update-5000-children",
    excerpt: "Despite challenges, we've distributed winter supplies to thousands of children facing harsh conditions.",
    content: "In high-altitude valleys, temperatures drop below -15°C. With the help of our donors, our local teams successfully distributed 5,000 heavy insulated coats and winter boots to barefoot children.",
    author: "Dr. Fatima Khan",
    tags: ["Recovery Progress", "Afghanistan", "Winter Appeal"],
    featuredImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2026-05-10T12:00:00Z"),
    updatedAt: new Date("2026-05-10T12:00:00Z")
  },
  {
    title: "Turkey-Syria Earthquake: 1 Year Later",
    slug: "turkey-syria-earthquake-1-year-later",
    excerpt: "A comprehensive look at long-term recovery efforts and the communities we've helped rebuild.",
    content: "One year after the devastating earthquakes, we review our rebuilding projects: building safe permanent housing, restoring schools, and supporting small businesses in recovered towns.",
    author: "Elena Rodriguez",
    tags: ["Recovery Progress", "Earthquake Relief"],
    featuredImage: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2026-05-08T12:00:00Z"),
    updatedAt: new Date("2026-05-08T12:00:00Z")
  },
  {
    title: "Volunteer Story: Why I Keep Coming Back",
    slug: "volunteer-story-why-i-keep-coming-back",
    excerpt: "A volunteer nurse shares her emotional journey working in disaster zones around the world.",
    content: "Lisa Chen shares what motivates her to spend months in overcrowded camps providing urgent clinical care and hope to those who have lost everything.",
    author: "Lisa Chen",
    tags: ["Field Diaries", "Volunteers"],
    featuredImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2026-05-05T12:00:00Z"),
    updatedAt: new Date("2026-05-05T12:00:00Z")
  },
  {
    title: "Transparency Report: Where Every Dollar Goes",
    slug: "transparency-report-quarterly",
    excerpt: "Our quarterly breakdown showing exactly how donations are allocated across programs and regions.",
    content: "Transparency is our highest value. In this detailed report, we break down administrative overhead (kept under 15%), local aid purchases, logistics costs, and project allocation charts.",
    author: "Hope Charity Team",
    tags: ["Transparency Updates", "Financials"],
    featuredImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    createdAt: new Date("2026-05-01T12:00:00Z"),
    updatedAt: new Date("2026-05-01T12:00:00Z")
  }
];

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      global.inMemoryBlogs = global.inMemoryBlogs || [...defaultBlogs];
      const blogPost = {
        ...req.body,
        author: req.user.id,
        _id: 'blog_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      global.inMemoryBlogs.unshift(blogPost);
      console.log('[In-Memory DB] Stored blog post:', blogPost);
      return res.status(201).json({ message: 'Blog post created successfully (In-Memory Fallback)', blogPost });
    }

    const blogPost = new Blog({ ...req.body, author: req.user.id });
    await blogPost.save();
    res.status(201).json({ message: 'Blog post created successfully', blogPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      global.inMemoryBlogs = global.inMemoryBlogs || [...defaultBlogs];
      return res.json(global.inMemoryBlogs);
    }

    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;