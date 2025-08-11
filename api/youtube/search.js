
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { channelId, part, type, order, maxResults } = req.query;
    
    // Usar la API key desde variables de entorno
    const apiKey = process.env.YOUTUBE_API_KEY || req.query.key;

    if (!apiKey || !channelId) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=${part}&type=${type}&order=${order}&maxResults=${maxResults}`;

    console.log('🚀 Llamando a YouTube API:', youtubeUrl);

    const response = await fetch(youtubeUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Angular-App/1.0'
      }
    });

    if (!response.ok) {
      console.error('❌ Error en YouTube API:', response.status, response.statusText);
      res.status(response.status).json({ 
        error: 'YouTube API error', 
        status: response.status,
        statusText: response.statusText 
      });
      return;
    }

    const data = await response.json();
    console.log('✅ Respuesta exitosa de YouTube API');

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error interno:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
