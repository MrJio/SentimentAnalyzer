import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SentimentChart from "./SentimentChart";
import "./App.css";

const SecondPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query");
  const [summary, setSummary] = useState("Loading summary...");
  const [sentiment, setSentiment] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [socialMediaData, setSocialMediaData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/news?query=${searchQuery}`);
        const data = await response.json();
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary("No summary available.");
        }

        if (data.sentiment) {
          setSentiment(data.sentiment);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        setSummary("Failed to load summary.");
      }
    };

    if (searchQuery) {
      fetchSummary();
    }
  }, [searchQuery]);

  return (
    <div className="secondPageContainer">
      {/* Search Query Box + Back Button */}
      <div className="searchHeader">
        <div className="searchBox2">{searchQuery}</div>
        <button className="backButton" onClick={() => navigate("/")}>←</button>
      </div>

      
      <div className="contentContainer">
     
        <div className="summaryBox">
          <h2>Topic Summary</h2>
          <p>{summary}</p>
        </div>

        
        <div className="rightSections">
          {/* Social Media Analysis Charts*/}
          <div className="socialMediaBox">
            <h2>Social Media Analysis Charts</h2>
            <SentimentChart data={socialMediaData || { datasets: [{ data: [0, 0, 0] }] }} />
          </div>

          {/* Sentiment Summary Box */}
          <div className="sentimentSummaryBox">
            {sentiment ? (
              <div className="sentimentContent">
                <span className="sentimentLabel">{sentiment.sentiment}</span>
                <span className="sentimentPercentage">{sentiment.percentage}</span>
                <span className="sentimentConfidence">{sentiment.confidence}</span>
              </div>
            ) : (
              <h2>Sentiment Summary</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;


