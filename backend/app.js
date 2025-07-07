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

// Add an interaction to a customer
app.post('/customers/:id/interactions', (req, res) => {
  const db = readDB();
  const customer = db.customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  const { channel, duration, content } = req.body;
  if (!channel || !duration || !content) {
    return res.status(400).json({ error: 'channel, duration, and content are required' });
  }
  // Mock AI sentiment analysis with more sophisticated logic
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
  
  // Determine escalation based on sentiment and duration
  const escalated = (sentiment.includes('angry') || sentiment.includes('frustrated') || 
                    (sentiment.includes('negative') && duration > 45)) && Math.random() < 0.4;
  const interaction = { channel, duration, content, sentiment, escalated };
  customer.interactions.push(interaction);
  writeDB(db);
  res.status(201).json(interaction);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});