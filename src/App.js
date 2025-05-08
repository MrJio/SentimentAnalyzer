import React, { useState, useEffect } from 'react';
import './App.css';
import SecondPage from "./SecondPage";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

const Home = () => {
  const titleText = "Sentiment Analyzer";
  const placeholderText = "What would you like to explore today? 🌍🔍";
  const [typedTitle, setTypedTitle] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const titleInterval = setInterval(() => {
      if (index < titleText.length) {
        setTypedTitle(titleText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(titleInterval);
        setTimeout(() => setShowSearch(true), 500);
      }
    }, 100);
    return () => clearInterval(titleInterval);
  }, []);

  useEffect(() => {
    if (showSearch) {
      let placeholderIndex = 0;
      const placeholderInterval = setInterval(() => {
        if (placeholderIndex < placeholderText.length) {
          setTypedPlaceholder(placeholderText.slice(0, placeholderIndex + 1));
          placeholderIndex++;
        } else {
          clearInterval(placeholderInterval);
        }
      }, 50);
      return () => clearInterval(placeholderInterval);
    }
  }, [showSearch]);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const saveSearch = (query) => {
    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 15);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      saveSearch(searchQuery.trim());
      navigate(`/results?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClick = (query) => {
    navigate(`/results?query=${encodeURIComponent(query)}`);
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const removeSearch = (index) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Recent Searches</h2>
        </div>

        {recentSearches.length > 0 ? (
          <>
            <button className="clearBtn" onClick={clearSearches}>Clear</button>
            <ul className="search-list">
              {recentSearches.map((query, index) => (
                <li key={index} className="search-item">
                  <button className="recentQuery" onClick={() => handleSearchClick(query)}>
                    {query}
                  </button>
                  <button className="removeBtn" onClick={() => removeSearch(index)}>x</button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="no-searches-msg">No recent searches</div>
        )}
      </div>

      <div className="main-section">
        <h1 className="title">{typedTitle}</h1>
        {showSearch && (
          <input
            type="text"
            className="searchBox"
            placeholder={typedPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<SecondPage />} />
      </Routes>
    </Router>
  );
};

export default App;
