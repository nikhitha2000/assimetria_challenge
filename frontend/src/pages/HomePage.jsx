import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../api/client';
import './HomePage.css';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articlesAPI.getAll();
      setArticles(data.articles || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchArticles}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="home-page">
        <h2>Latest Articles</h2>
        
        {articles.length === 0 ? (
          <div className="no-articles">
            <p>No articles found. Check back soon!</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card">
                <Link to={`/article/${article.id}`}>
                  <h3>{article.title}</h3>
                  {article.excerpt && (
                    <p className="excerpt">{article.excerpt}</p>
                  )}
                  <div className="article-meta">
                    <span className="date">
                      {formatDate(article.created_at)}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {articles.length > 0 && (
          <div className="article-count">
            <p>Showing {articles.length} article{articles.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;


