import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";

const SecondPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/news?query=${searchQuery}`);
        const data = await response.json();
        console.log("First 3 Article Titles:", data.results?.slice(0, 3).map(article => article.title));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    if (searchQuery) {
      fetchNews();
    }
  }, [searchQuery]);

  return (
    <div className="secondPageContainer">
      {/* Search Query Box + Back Button */}
      <div className="searchHeader">
        <div className="searchBox2">{searchQuery}</div>
        <button className="backButton" onClick={() => navigate("/")}>🔙 Back to Home</button>
      </div>

      
      <div className="contentContainer">
     
        <div className="analysisBox">
          <h2>Analysis</h2>
          <p>Detailed insights about <strong>{searchQuery}</strong></p>
        </div>

        
        <div className="rightSections">
          
          <div className="socialMediaBox">
            <h2>Social Media Analysis Charts</h2>
            <p>Graphs, trends & insights</p>
          </div>

        
          <div className="newsCompilerBox">
            <h2>News Compiler</h2>
            <p>Latest news & updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;


