import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

import SecondPage from "./SecondPage";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";




const Home = () => {
  const titleText = "Sentiment Analyzer";
  const placeholderText = "What would you like to explore today? 🌍🔍";
  const [typedTitle, setTypedTitle] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="container">
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