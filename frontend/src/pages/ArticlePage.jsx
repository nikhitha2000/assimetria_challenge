import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../api/client';
import './ArticlePage.css';

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await articlesAPI.getById(id);
      setArticle(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching article:', err);
      if (err.response?.status === 404) {
        setError('Article not found');
      } else {
        setError('Failed to load article. Please try again later.');
      }
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container">
        <div className="error-message">
          <p>{error || 'Article not found'}</p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="article-page">
        <Link to="/" className="back-link">← Back to Articles</Link>
        
        <article className="article-full">
          <header className="article-header">
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span className="date">
                Published: {formatDate(article.created_at)}
              </span>
              {article.updated_at !== article.created_at && (
                <span className="date">
                  Updated: {formatDate(article.updated_at)}
                </span>
              )}
            </div>
          </header>

          <div className="article-content">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default ArticlePage;


