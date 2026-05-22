const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS options to allow your specific frontend origin and credentials
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // This should be your frontend's URL, e.g., 'http://localhost:3001'
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the HTTP methods your frontend will use
  credentials: true, // This is crucial if your frontend sends cookies or auth headers
};

// Use CORS middleware with the configured options
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

const contactRoutes = require('./routes/contact');
const donationRoutes = require('./routes/donations');
const blogRoutes = require('./routes/blogs');

app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/blogs', blogRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Auto-seed default blogs if empty
    const Blog = require('./models/Blogs');
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('Seeding default blog posts...');
      const defaultBlogs = [
        {
          title: "Field Diary: 30 Days in Gaza",
          slug: "field-diary-30-days-in-gaza",
          excerpt: "Our team shares raw, unfiltered accounts from the ground as we help families rebuild after devastating attacks.",
          content: "Humanitarian conditions in Gaza are extremely critical. Our ground teams have spent 30 days distributing heavy thermal shelter kits, food, and clean water. Here is a raw account of what we witness...",
          author: "60c72b2f9b1d8c001f8e4a9a",
          tags: ["Field Diaries", "Gaza", "Emergency"],
          featuredImage: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Donor Spotlight: The Johnson Family's 10-Year Journey",
          slug: "donor-spotlight-johnson-family",
          excerpt: "How a small monthly donation became a lifeline for hundreds of families across three continents.",
          content: "We sit down with the Johnson family to talk about why they chose monthly giving, and how their steady support has funded long-term clean water wells and clinic supplies.",
          author: "60c72b2f9b1d8c001f8e4a9a",
          tags: ["Donor Spotlights", "Monthly Support"],
          featuredImage: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Afghanistan Winter Update: Reaching 5,000 Children",
          slug: "afghanistan-winter-update-5000-children",
          excerpt: "Despite challenges, we've distributed winter supplies to thousands of children facing harsh conditions.",
          content: "In high-altitude valleys, temperatures drop below -15°C. With the help of our donors, our local teams successfully distributed 5,000 heavy insulated coats and winter boots to barefoot children.",
          author: "60c72b2f9b1d8c001f8e4a9a",
          tags: ["Recovery Progress", "Afghanistan", "Winter Appeal"],
          featuredImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Turkey-Syria Earthquake: 1 Year Later",
          slug: "turkey-syria-earthquake-1-year-later",
          excerpt: "A comprehensive look at long-term recovery efforts and the communities we've helped rebuild.",
          content: "One year after the devastating earthquakes, we review our rebuilding projects: building safe permanent housing, restoring schools, and supporting small businesses in recovered towns.",
          author: "60c72b2f9b1d8c001f8e4a9a",
          tags: ["Recovery Progress", "Earthquake Relief"],
          featuredImage: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Volunteer Story: Why I Keep Coming Back",
          slug: "volunteer-story-why-i-keep-coming-back",
          excerpt: "A volunteer nurse shares her emotional journey working in disaster zones around the world.",
          content: "Lisa Chen shares what motivates her to spend months in overcrowded camps providing urgent clinical care and hope to those who have lost everything.",
          author: "60c72b2f9b1d8c001f8e4a9a",
          tags: ["Field Diaries", "Volunteers"],
          featuredImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Transparency Report: Where Every Dollar Goes",
          slug: "transparency-report-quarterly",
          excerpt: "Our quarterly breakdown showing exactly how donations are allocated across programs and regions.",
          content: "Transparency is our highest value. In this detailed report, we break down administrative overhead (kept under 15%), local aid purchases, logistics costs, and project allocation charts.",
          author: "60c72b2f9b1d8c001f8e4a9a",
          tags: ["Transparency Updates", "Financials"],
          featuredImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
      ];
      await Blog.insertMany(defaultBlogs);
      console.log('Seeded 6 blog posts successfully');
    }
  } catch (err) {
    console.warn('\n======================================================');
    console.warn('WARNING: Could not connect to MongoDB at', process.env.MONGO_URI);
    console.warn('The server will run using a secure IN-MEMORY Mock Database.');
    console.warn('Any submissions (donations/messages) will be kept in memory.');
    console.warn('======================================================\n');
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
