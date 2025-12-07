# API Documentation

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `http://your-ec2-ip:5000/api`

## Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### List Articles

**GET** `/api/articles`

Retrieve a list of all articles with pagination.

**Query Parameters:**
- `limit` (optional): Number of articles to return (default: 50)
- `offset` (optional): Number of articles to skip (default: 0)

**Example Request:**
```
GET /api/articles?limit=10&offset=0
```

**Response:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "The Future of Technology",
      "excerpt": "Technology continues to evolve at an unprecedented pace...",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Understanding Modern Web Development",
      "excerpt": "Web development has come a long way...",
      "created_at": "2024-01-14T10:00:00.000Z",
      "updated_at": "2024-01-14T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

**Status Codes:**
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

### Get Single Article

**GET** `/api/articles/:id`

Retrieve a single article by its ID, including full content.

**Path Parameters:**
- `id` (required): Article ID (integer)

**Example Request:**
```
GET /api/articles/1
```

**Response:**
```json
{
  "id": 1,
  "title": "The Future of Technology",
  "content": "Technology continues to evolve at an unprecedented pace, shaping the way we live, work, and interact with the world around us. From artificial intelligence to renewable energy, innovations are transforming every aspect of our daily lives.\n\nIn recent years, we've witnessed remarkable advances...",
  "excerpt": "Technology continues to evolve at an unprecedented pace...",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid article ID
- `404 Not Found`: Article not found
- `500 Internal Server Error`: Server error

---

### Generate Article (Admin)

**POST** `/api/articles/generate`

Manually trigger article generation. This is useful for testing or generating articles on-demand.

**Request Body:**
```json
{
  "topic": "Optional topic for article generation"
}
```

**Example Request:**
```
POST /api/articles/generate
Content-Type: application/json

{
  "topic": "The future of artificial intelligence"
}
```

**Response:**
```json
{
  "message": "Article generated successfully",
  "article": {
    "id": 11,
    "title": "The Future Of Artificial Intelligence",
    "excerpt": "Artificial intelligence is rapidly transforming...",
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T11:00:00.000Z"
  }
}
```

**Status Codes:**
- `201 Created`: Article generated successfully
- `500 Internal Server Error`: Generation failed

**Note:** This endpoint is open for testing purposes. In production, you may want to add authentication.

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Currently, there are no rate limits implemented. However, for production use, consider implementing rate limiting using middleware like `express-rate-limit`.

---

## CORS

The API is configured to accept requests from the frontend URL specified in `FRONTEND_URL` environment variable.

Default: `http://localhost:3000` (development)

---

## Authentication

Currently, the API does not require authentication. For production use, consider implementing:
- API key authentication
- JWT tokens
- OAuth 2.0

---

## Data Models

### Article

```typescript
{
  id: number;              // Auto-generated primary key
  title: string;           // Article title (max 500 chars)
  content: string;         // Full article content (text)
  excerpt: string;         // Short excerpt (first 200 chars)
  created_at: string;      // ISO 8601 timestamp
  updated_at: string;      // ISO 8601 timestamp
}
```

---

## Example Usage

### JavaScript/React

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get all articles
const articles = await axios.get(`${API_URL}/articles`);

// Get single article
const article = await axios.get(`${API_URL}/articles/1`);

// Generate article
const newArticle = await axios.post(`${API_URL}/articles/generate`, {
  topic: 'Technology trends'
});
```

### cURL

```bash
# Get all articles
curl http://localhost:5000/api/articles

# Get single article
curl http://localhost:5000/api/articles/1

# Generate article
curl -X POST http://localhost:5000/api/articles/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI and machine learning"}'
```



