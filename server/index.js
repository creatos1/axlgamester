const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/youtube/search', async (req, res) => {
  try {
    const { channelId, part, type, order, maxResults } = req.query;
    
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey || !channelId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=${part}&type=${type}&order=${order}&maxResults=${maxResults}`;

    console.log('🚀 Calling YouTube API');

    const response = await fetch(youtubeUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Angular-App/1.0'
      }
    });

    if (!response.ok) {
      console.error('❌ YouTube API error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'YouTube API error', 
        status: response.status,
        statusText: response.statusText 
      });
    }

    const data = await response.json();
    console.log('✅ YouTube API response successful');

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Internal error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API server listening on http://0.0.0.0:${PORT}`);
});
