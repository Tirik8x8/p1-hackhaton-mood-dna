const express = require('express');
const cors = require('cors');
const { readDB, writeDB } = require('./db');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// ...existing code...

// Get all customers
app.get('/customers', (req, res) => {
  const db = readDB();
  res.json(db.customers);
});

// Get a single customer by id
app.get('/customers/:id', (req, res) => {
  const db = readDB();
  const customer = db.customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// Add a new customer
app.post('/customers', (req, res) => {
  const db = readDB();
  const newCustomer = req.body;
  newCustomer.id = db.customers.length ? Math.max(...db.customers.map(c => c.id)) + 1 : 1;
  newCustomer.interactions = [];
  db.customers.push(newCustomer);
  writeDB(db);
  res.status(201).json(newCustomer);
});

// Generate random content based on channel
const generateRandomContent = (channel) => {
  const contentTemplates = {
    email: [
      'I need help with my account settings',
      'Thank you for your assistance',
      'I have a question about billing',
      'There seems to be an issue with my order',
      'Can you help me understand this feature?',
      'I\'m experiencing technical difficulties',
      'Great service, very satisfied',
      'This is taking too long to resolve'
    ],
    phone: [
      'Called regarding billing inquiry',
      'Phone support for technical issue',
      'Urgent matter needs immediate attention',
      'Follow-up call on previous issue',
      'General inquiry about services',
      'Complaint about service quality',
      'Praise for excellent support',
      'Request for account information'
    ],
    chat: [
      'Quick question via chat',
      'Live chat support session',
      'Need immediate assistance',
      'Chat inquiry about product',
      'Technical support via chat',
      'Billing question through chat',
      'Product information request',
      'Issue resolution via chat'
    ],
    social: [
      'Social media inquiry',
      'Public complaint on social platform',
      'Positive feedback on social media',
      'Question posted on company page',
      'Social media support request',
      'Public praise for service',
      'Issue raised on social platform',
      'Community forum discussion'
    ]
  };

  const templates = contentTemplates[channel] || contentTemplates.email;
  return templates[Math.floor(Math.random() * templates.length)];
};

// Add an interaction to a customer
app.post('/customers/:id/interactions', (req, res) => {
  const db = readDB();
  const customer = db.customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  let { channel, duration, content, date } = req.body;

  // Validate required fields
  if (!channel) {
    return res.status(400).json({ error: 'channel is required' });
  }

  // Generate random values if not provided
  if (!duration) {
    duration = Math.floor(Math.random() * 90) + 5; // 5-95 minutes
  }

  if (!content) {
    content = generateRandomContent(channel);
  }

  if (!date) {
    // Generate random date within last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
    date = new Date(randomTime).toISOString();
  }

  // Random sentiment generation
  const sentiments = [
    'very positive', 'positive', 'slightly positive', 'neutral', 'slightly negative',
    'negative', 'very negative', 'confused', 'angry', 'frustrated', 'satisfied',
    'excited', 'disappointed', 'grateful', 'curious'
  ];

  // Determine sentiment based on content and duration
  let sentiment;
  const contentLower = content.toLowerCase();

  if (contentLower.includes('problem') || contentLower.includes('issue') || contentLower.includes('broken')) {
    sentiment = duration > 30 ? 'frustrated' : 'disappointed';
  } else if (contentLower.includes('thank') || contentLower.includes('great') || contentLower.includes('excellent')) {
    sentiment = 'grateful';
  } else if (contentLower.includes('help') || contentLower.includes('question')) {
    sentiment = 'curious';
  } else if (duration > 60) {
    sentiment = Math.random() < 0.3 ? 'frustrated' : 'neutral';
  } else if (duration < 10) {
    sentiment = Math.random() < 0.7 ? 'satisfied' : 'positive';
  } else {
    sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  }

  // Random escalation based on sentiment and duration
  const escalated = (sentiment.includes('angry') || sentiment.includes('frustrated') ||
                    (sentiment.includes('negative') && duration > 45)) && Math.random() < 0.4;

  const interaction = {
    date,
    channel,
    duration: Number(duration),
    content,
    sentiment,
    escalated,
    aiGenerated: true, // Mark as AI generated
    generatedAt: new Date().toISOString()
  };

  customer.interactions.push(interaction);
  writeDB(db);
  res.status(201).json(interaction);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});