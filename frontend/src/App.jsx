import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="container">
            <h1>📚 Auto-Generated Blog</h1>
            <p>AI-powered articles, automatically generated daily</p>
          </div>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>Built with React, Node.js, and AI ✨</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;


