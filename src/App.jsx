import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [stats, setStats] = useState({ removed: 0 });
  const [copied, setCopied] = useState(false);

  const cleanText = (text) => {
    let cleaned = text;
    let removedCount = 0;

    const zeroWidthChars = /[\u200B-\u200D\uFEFF\u2060]/g;
    const zeroWidthMatches = cleaned.match(zeroWidthChars);
    if (zeroWidthMatches) removedCount += zeroWidthMatches.length;
    cleaned = cleaned.replace(zeroWidthChars, '');

    const invisibleChars = /[\u0000-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u2000-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFFB]/g;
    const invisibleMatches = cleaned.match(invisibleChars);
    if (invisibleMatches) removedCount += invisibleMatches.length;
    cleaned = cleaned.replace(invisibleChars, '');

    cleaned = cleaned.replace(/[\u201C\u201D]/g, '"');
    cleaned = cleaned.replace(/[\u2018\u2019]/g, "'");
    cleaned = cleaned.replace(/[\u2013\u2014]/g, '-');
    cleaned = cleaned.replace(/\u00A0/g, ' ');
    cleaned = cleaned.replace(/ {2,}/g, ' ');
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    return { text: cleaned, removedCount };
  };

  const handleClean = () => {
    const result = cleanText(inputText);
    setCleanedText(result.text);
    setStats({ removed: result.removedCount });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cleanedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setCleanedText('');
    setStats({ removed: 0 });
  };

  return (
    <div className="app">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="container">
        <header className="header">
          <h1 className="title">✨ Clean AI Text</h1>
          <p className="subtitle">Remove invisible characters & watermarks instantly</p>
        </header>

        {stats.removed > 0 && (
          <div className="stats-badge">
            <span className="badge-icon">✓</span>
            <span>{stats.removed} characters removed</span>
          </div>
        )}

        <div className="card">
          <div className="editor-grid">
            <div className="editor-section">
              <label className="label">Input</label>
              <textarea
                className="textarea"
                placeholder="Paste AI-generated text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
              />
              <div className="char-count">{inputText.length}</div>
            </div>

            <div className="divider"></div>

            <div className="editor-section">
              <label className="label">Cleaned</label>
              <textarea
                className="textarea"
                placeholder="Clean text appears here..."
                value={cleanedText}
                readOnly
                rows={12}
              />
              <div className="char-count">{cleanedText.length}</div>
            </div>
          </div>

          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={handleClean}
              disabled={!inputText}
            >
              Clean Text
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={handleCopy}
              disabled={!cleanedText}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            
            <button 
              className="btn btn-ghost" 
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="features">
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <div className="feature-text">
              <h3>Zero-Width Chars</h3>
              <p>Removes ZWSP, ZWNJ, ZWJ</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <div className="feature-text">
              <h3>Hidden Spaces</h3>
              <p>Non-breaking spaces</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <div className="feature-text">
              <h3>Smart Quotes</h3>
              <p>Convert to ASCII</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <div className="feature-text">
              <h3>Control Chars</h3>
              <p>Remove markers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
