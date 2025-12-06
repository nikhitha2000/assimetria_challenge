# Blog Frontend

React frontend for the auto-generated blog application.

## Features

- Article listing page
- Individual article detail page
- Responsive design
- Modern UI with React Router

## Setup

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Create .env file
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   Opens http://localhost:3000

### Docker

```bash
docker build -t blog-frontend .
docker run -p 80:80 blog-frontend
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   └── ArticlePage.jsx
│   ├── api/
│   │   └── client.js   # API client
│   ├── App.jsx         # Main app component
│   └── index.js        # Entry point
├── Dockerfile
└── package.json
```

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000)

## Building for Production

```bash
npm run build
```

Production build is output to `build/` directory.

## Deployment

The frontend is served via Nginx in production (see `Dockerfile` and `nginx.conf`).

## Styling

CSS modules and regular CSS files. Uses modern CSS features:
- Flexbox/Grid for layout
- CSS variables for theming
- Responsive design with media queries


