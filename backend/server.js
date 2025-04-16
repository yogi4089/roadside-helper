// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const customerRoutes = require('./routes/customerRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${decodeURIComponent(req.url)}`);
  next();
});

// API routes
app.use('/api/customers', customerRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the views directory
const viewsPath = path.join(__dirname, '../views');
app.use(express.static(viewsPath));

// Serve the main page for the root route and /page%201
app.get(['/', '/page 1', '/page1'], (req, res) => {
  console.log('Serving main page');
  const mainPage = path.join(viewsPath, 'page 1.html');
  res.sendFile(mainPage, (err) => {
    if (err) {
      console.error('Error serving main page:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Handle specific routes with spaces and hyphens
const pages = [
  { url: 'user registration', file: 'user registration.html' },
  { url: 'userprofile', file: 'userprofile.html' },
  { url: 'request service', file: 'request-service.html' },
  { url: 'request-service', file: 'request-service.html' },
  { url: 'loginuser', file: 'loginuser.html' },
  { url: 'meclogin', file: 'meclogin.html' },
  { url: 'mecsignup', file: 'mecsignup.html' },
  { url: 'mecprofile', file: 'mecprofile.html' },
  { url: 'mechprofile', file: 'mecprofile.html' },
  { url: 'dashcust', file: 'dashcust.html' },
  { url: 'history', file: 'user-history.html' },
  { url: 'ongoing', file: 'ongoing.html' },
  { url: 'tutorial', file: 'tutorial.html' }
];

// Set up routes for each page
pages.forEach(page => {
  app.get(`/${page.url}`, (req, res) => {
    console.log(`Serving ${page.url} page`);
    const filePath = path.join(viewsPath, page.file);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error serving ${page.url} page:`, err);
        res.status(404).sendFile(path.join(viewsPath, 'page 1.html'));
      }
    });
  });
});

// Handle 404 errors
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${decodeURIComponent(req.url)}`);
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: 'API endpoint not found' });
  } else {
    res.status(404).sendFile(path.join(viewsPath, 'page 1.html'));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});











