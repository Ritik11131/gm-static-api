const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.get('/api/map', async (req, res) => {
    console.log(req.query); // Log the query parameters for debugging
    
  try {
    // Google Maps Static API URL
    const googleMapsUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    
    // Get API key from query params or use default
    const apiKey = req.query.key || 'AIzaSyANwFnZ6Y1rv6lh209CahpsqNUnCmCpC58';
    
    // Build params from query parameters
    const params = {
      key: apiKey,
      // Default size if not provided
      size: req.query.size || '600x300'
    };
    
    // Add any query parameters that were provided
    if (req.query.path) params.path = req.query.path;
    if (req.query.markers) {
      if (Array.isArray(req.query.markers)) {
        params.markers = req.query.markers; // axios will serialize this as repeated &markers=
      } else {
        params.markers = [req.query.markers];
      }
    }
    if (req.query.maptype) params.maptype = req.query.maptype;
    if (req.query.zoom) params.zoom = req.query.zoom;
    if (req.query.scale) params.scale = req.query.scale;
    if (req.query.center) params.center = req.query.center;
    
    // Get authorization token from request headers
    const authToken = req.headers.authorization;
    
    // Build headers
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*'
    };
    
    // Add authorization if it exists
    if (authToken) {
      headers['Authorization'] = authToken;
    }

    // Log the request details (for debugging)
    console.log('Making request to Google Maps API:');
    console.log('URL:', googleMapsUrl);
    console.log('Params:', params);
    console.log('Headers:', Object.keys(headers));
    
    // Make the request to Google Maps API
    const response = await axios({
      method: 'get',
      url: googleMapsUrl,
      params: params,
      headers: headers,
      responseType: 'arraybuffer',
      paramsSerializer: (params) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => qs.append(key, v));
          } else {
            qs.append(key, value);
          }
        });
        const queryString = qs.toString();
        console.log('Full URL:', `${googleMapsUrl}?${queryString}`);
        return queryString;
      }
    });
    

    // Set appropriate headers for the image response
    res.set('Content-Type', response.headers['content-type']);
    res.set('Content-Length', response.data.length);
    
    // Send the image data back to the client
    res.send(response.data);
    
  } catch (error) {
    console.error('Error fetching map:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data.toString());
    }
    res.status(500).json({ 
      error: 'Failed to fetch map data',
      details: error.message
    });
  }
});

// Root endpoint with usage information
app.get('/', (req, res) => {
  res.send(`
    <h1>Google Maps Static API Proxy</h1>
    <p>Use the /api/map endpoint to get the static map image.</p>
    <p>You can pass parameters like:</p>
    <ul>
      <li>size: Map dimensions (WIDTHxHEIGHT)</li>
      <li>path: Path to draw (color:0x0000ff|weight:5|lat1,lng1|lat2,lng2|...)</li>
      <li>markers: Location markers (color:red|label:S|lat,lng)</li>
      <li>maptype: Type of map (roadmap, satellite, terrain, hybrid)</li>
      <li>zoom: Zoom level</li>
    </ul>
    <p>Example: <a href="/api/map?path=color:0x0000ff|weight:5|26.8034398,75.8178277|26.8379236,75.8143056&markers=color:red|label:S|26.8034398,75.8178277&markers=color:green|label:D|26.8379236,75.8143056">/api/map with path and markers</a></p>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});