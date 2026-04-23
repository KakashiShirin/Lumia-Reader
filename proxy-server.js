import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Proxy Endpoint
app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    res.json({ contents: html });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Local Storage Endpoints
// IMPORTANT: /store/list must come BEFORE /store/:key to avoid matching "list" as a key parameter
app.get('/store/list', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/store/:key', (req, res) => {
  try {
    const key = req.params.key;
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(DATA_DIR, `${safeKey}.json`);

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/store/:key', (req, res) => {
  try {
    const key = req.params.key;
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(DATA_DIR, `${safeKey}.json`);

    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3005, () => console.log('Proxy server running on port 3005'));