// Utility functions for working with customers and interactions
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

function readDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ customers: [] }, null, 2));
  }
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
