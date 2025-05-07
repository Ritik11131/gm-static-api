# Google Maps Static API Proxy

This Node.js application creates a proxy for the Google Maps Static API that fetches a static map image with a specified path and markers.

## Installation

1. Make sure you have Node.js installed (version 14 or newer recommended)
2. Clone or download this repository
3. Navigate to the project directory and install dependencies:

```bash
npm install
```

## Running the Application

Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will run on port 3000 by default (or the port specified in the PORT environment variable).

## API Usage

### Get Static Map Image

Access the static map image by making a GET request to:

```
http://localhost:3000/api/map
```

#### Required Parameters

None - the API will use default values if no parameters are provided.

#### Optional Parameters

You can customize the map by passing the following query parameters:

- `key`: Your Google Maps API key (default will be used if not provided)
- `size`: Map dimensions in pixels (format: WIDTHxHEIGHT, default: 600x300)
- `path`: Path to draw on the map (format: color:0x0000ff|weight:5|lat1,lng1|lat2,lng2|...)
- `markers`: Location markers (format: color:red|label:S|lat,lng). Can be provided multiple times for multiple markers.
- `maptype`: Type of map (roadmap, satellite, terrain, hybrid)
- `zoom`: Zoom level of the map
- `scale`: Resolution of the map (1 or 2)
- `center`: The center point of the map (format: lat,lng)

Example with parameters:
```
http://localhost:3000/api/map?size=800x400&path=color:0x0000ff|weight:5|26.8034398,75.8178277|26.8379236,75.8143056&markers=color:red|label:S|26.8034398,75.8178277&markers=color:green|label:D|26.8379236,75.8143056
```

#### Authorization

To include an authorization token, set the `Authorization` header in your request.

### Browser Usage

You can simply navigate to http://localhost:3000/api/map in your browser to view the image directly.

### In Applications

You can use this API in your applications by making a GET request to the `/api/map` endpoint.

Example with fetch:

```javascript
fetch('http://localhost:3000/api/map')
  .then(response => {
    if (response.ok) {
      // For displaying the image
      const imageUrl = URL.createObjectURL(response.blob());
      // Do something with the image URL
    }
  })
  .catch(error => console.error('Error fetching map:', error));
```

## Customization

To modify the map parameters (coordinates, colors, etc.), edit the `params` object in the `index.js` file.# gm-static-api
